'use client';

import type { Column } from '@tanstack/react-table';
import {
  Check,
  ChevronDown,
  ChevronRight,
  PlusCircle,
  XCircle,
} from 'lucide-react';
import * as React from 'react';
import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { CascaderNode } from '@/components/autoform/components/CascaderField';
import { TextEllipsis } from '@/components/ui/text-ellipsis';

// ── Flat node helpers (mirrors CascaderField internals) ───────────────────────

interface FlatNode {
  id: string;
  label: string;
  depth: number;
  isLastChild: boolean;
  hasMoreSiblings: boolean[];
  hasChildren: boolean;
}

function flattenTree(
  nodes: CascaderNode[],
  depth = 0,
  hasMoreSiblings: boolean[] = [],
): FlatNode[] {
  return nodes.flatMap((node, idx) => {
    const isLastChild = idx === nodes.length - 1;
    return [
      {
        id: node.id,
        label: node.label,
        depth,
        isLastChild,
        hasMoreSiblings,
        hasChildren: (node.children?.length ?? 0) > 0,
      },
      ...flattenTree(node.children ?? [], depth + 1, [
        ...hasMoreSiblings,
        !isLastChild,
      ]),
    ];
  });
}

function visibleNodes(
  nodes: CascaderNode[],
  expanded: Set<string>,
  depth = 0,
  hasMoreSiblings: boolean[] = [],
): FlatNode[] {
  return nodes.flatMap((node, idx) => {
    const isLastChild = idx === nodes.length - 1;
    const flat: FlatNode = {
      id: node.id,
      label: node.label,
      depth,
      isLastChild,
      hasMoreSiblings,
      hasChildren: (node.children?.length ?? 0) > 0,
    };
    const children =
      expanded.has(node.id) && node.children?.length
        ? visibleNodes(node.children, expanded, depth + 1, [
          !isLastChild,
            ...hasMoreSiblings,
          ])
        : [];
    return [flat, ...children];
  });
}

// ── Tree connector lines ──────────────────────────────────────────────────────

function TreeLines({
  depth,
  isLastChild,
  hasMoreSiblings,
}: Pick<FlatNode, 'depth' | 'isLastChild' | 'hasMoreSiblings'>) {
  if (depth === 0) return null;
  return (
    <span
      aria-hidden
      className='flex shrink-0 self-stretch'
      style={{ width: depth * 20 }}
    >
      {Array.from({ length: depth }).map((_, i) => {
        const isCurrent = i === depth - 1;
        return (
          <span key={i} className='relative w-5 shrink-0 self-stretch'>
            {isCurrent ? (
              <>
                <span
                  className='absolute left-[9px] top-0 w-px bg-border'
                  style={{ height: 'calc(50% + 1px)' }}
                />
                <span
                  className='absolute top-1/2 h-px bg-border'
                  style={{ left: 9, right: -1 }}
                />
                {!isLastChild && (
                  <span
                    className='absolute left-[9px] w-px bg-border'
                    style={{ top: 'calc(50% + 1px)', bottom: 0 }}
                  />
                )}
              </>
            ) : (
              hasMoreSiblings[i] && (
                <span className='absolute inset-y-0 left-[9px] w-px bg-border' />
              )
            )}
          </span>
        );
      })}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface DataTableCascaderFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  nodes?: CascaderNode[];
  nodesQueryFn?: () => Promise<CascaderNode[]>;
  nodesQueryKey?: unknown[];
}

export function DataTableCascaderFilter<TData, TValue>({
  column,
  title,
  nodes: staticNodes,
  nodesQueryFn,
  nodesQueryKey,
}: DataTableCascaderFilterProps<TData, TValue>) {
  const t = useTranslations('dataTable');
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set());

  const { data: fetchedNodes = [] } = useQuery<CascaderNode[]>({
    queryKey: nodesQueryKey ?? ['cascader-filter', title],
    queryFn: nodesQueryFn!,
    enabled: open && !!nodesQueryFn,
    staleTime: Infinity,
  });

  const nodes = staticNodes ?? fetchedNodes;

  const columnFilterValue = column?.getFilterValue();
  const selectedValue = React.useMemo(
    () =>
      Array.isArray(columnFilterValue)
        ? (columnFilterValue[0] as string | undefined)
        : undefined,
    [columnFilterValue],
  );

  const allFlatNodes = React.useMemo(() => flattenTree(nodes), [nodes]);

  // Expand all by default when nodes first load
  React.useEffect(() => {
    if (allFlatNodes.length > 0) {
      setExpanded(
        new Set(allFlatNodes.filter((n) => n.hasChildren).map((n) => n.id)),
      );
    }
  }, [allFlatNodes]);

  const displayed = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (q) {
      const matchIds = new Set(
        allFlatNodes
          .filter((n) => n.label.toLowerCase().includes(q))
          .map((n) => n.id),
      );
      const allIds = new Set(
        allFlatNodes.filter((n) => n.hasChildren).map((n) => n.id),
      );
      return visibleNodes(nodes, allIds).filter((n) => matchIds.has(n.id));
    }
    return visibleNodes(nodes, expanded);
  }, [allFlatNodes, nodes, expanded, search]);

  const selectedLabel = allFlatNodes.find((n) => n.id === selectedValue)?.label;

  const onSelect = React.useCallback(
    (id: string) => {
      column?.setFilterValue(id === selectedValue ? undefined : [id]);
      setOpen(false);
      setSearch('');
    },
    [column, selectedValue],
  );

  const onReset = React.useCallback(
    (event?: React.MouseEvent) => {
      event?.stopPropagation();
      column?.setFilterValue(undefined);
    },
    [column],
  );

  const toggleExpand = React.useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  return (
    <Popover
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setSearch('');
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='border-dashed font-normal'
        >
          {selectedValue ? (
            <div
              role='button'
              aria-label={`Clear ${title} filter`}
              tabIndex={0}
              className='rounded-sm opacity-70 transition-opacity
                hover:opacity-100 focus-visible:outline-none
                focus-visible:ring-1 focus-visible:ring-ring'
              onClick={onReset}
            >
              <XCircle />
            </div>
          ) : (
            <PlusCircle />
          )}
          {title}
          {selectedLabel && (
            <>
              <Separator
                orientation='vertical'
                className='mx-0.5 data-[orientation=vertical]:h-4'
              />
              <Badge
                variant='secondary'
                className='max-w-[120px] rounded-sm px-1 font-normal'
              >
                <span className='truncate'>{selectedLabel}</span>
              </Badge>
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className='p-0'
        align='start'
        onWheel={(e) => e.stopPropagation()}
      >
        {/* Search */}
        <div className='border-b p-2'>
          <Input
            placeholder={title}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='h-8'
            autoFocus
          />
        </div>

        <ScrollArea className='h-64'>
          {displayed.length === 0 && (
            <div className='py-6 text-center text-sm text-muted-foreground'>
              No results found.
            </div>
          )}
          {displayed.length > 0 && (
            <div className='py-1'>
              {displayed.map((node) => {
                const isSelected = selectedValue === node.id;
                const isExpanded = expanded.has(node.id);
                const isSearching = !!search.trim();
                return (
                  <div
                    key={node.id}
                    className={cn(
                      'flex w-full items-stretch text-sm',
                      'hover:bg-accent hover:text-accent-foreground',
                      isSelected && 'bg-accent/50',
                    )}
                  >
                    {/* Tree connector lines */}
                    <TreeLines
                      depth={node.depth}
                      isLastChild={node.isLastChild}
                      hasMoreSiblings={node.hasMoreSiblings}
                    />

                    {/* Expand / collapse arrow */}
                    <span
                      className='flex w-5 shrink-0 items-center justify-center
                        self-stretch'
                    >
                      {node.hasChildren && !isSearching && (
                        <button
                          type='button'
                          onClick={(e) => toggleExpand(node.id, e)}
                          className='flex size-4 items-center justify-center
                            rounded text-muted-foreground hover:text-foreground'
                          aria-label={isExpanded ? 'Collapse' : 'Expand'}
                        >
                          {isExpanded ? (
                            <ChevronDown className='size-3.5' />
                          ) : (
                            <ChevronRight className='size-3.5' />
                          )}
                        </button>
                      )}
                    </span>

                    {/* Row label + check */}
                    <button
                      type='button'
                      onClick={() => onSelect(node.id)}
                      className='flex flex-1 max-w-64 items-center gap-2 py-1.5 pr-2
                        text-left'
                    >
                      <Check
                        className={cn(
                          'size-4 shrink-0',
                          isSelected ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      <TextEllipsis>{node.label}</TextEllipsis>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {selectedValue && (
          <>
            <Separator />
            <div className='p-1'>
              <button
                type='button'
                onClick={() => onReset()}
                className='w-full rounded-sm py-1.5 text-center text-sm
                  hover:bg-accent hover:text-accent-foreground'
              >
                {t('clearFilters')}
              </button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
