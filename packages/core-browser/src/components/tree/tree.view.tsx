import * as React from 'react';
import { TreeNode, TreeViewAction, SelectableTreeNode } from './';
import { TreeContainerNode, CommandActuator } from './tree-node.view';
import { isOSX, Event, FileDecorationsProvider, ThemeProvider, IFileDecoration, ExpandableTreeNode } from '@ali/ide-core-common';
import * as cls from 'classnames';
import * as styles from './tree.module.less';
import { node } from 'prop-types';

export const TEMP_FILE_NAME = 'kt_template_file';
export interface TreeProps extends React.PropsWithChildren<any> {
  /**
   * 可渲染的树节点
   */
  readonly nodes: TreeNode<any>[];
  /**
   * 左侧缩进（单位 px）
   * 默认缩进计算通过：leftPadding * depth
   */
  readonly leftPadding?: number;

  /**
   * 如果树组件支持多选，为`true`, 否则为 `false`
   */
  readonly multiSelectable?: boolean;

  /**
   * 是否在视图激活时自动滚动
   */
  readonly scrollIfActive?: boolean;

  /**
   * 是否可折叠
   */
  readonly foldable?: boolean;
  /**
   * 是否支持拖拽
   */
  readonly draggable?: boolean;

  /**
   * 是否可搜索
   */
  readonly searchable?: boolean;

  /**
   * 是否选中
   */
  readonly selected?: boolean;

  /**
   * 选择事件回调
   */
  onSelect?: any;

  /**
   * 折叠箭头点击回调
   */
  onTwistieClickHandler?: any;

  /**
   * 右键菜单事件回调
   */
  onContextMenu?: any;

  /**
   * 拖拽事件回调
   */
  onDragStart?: any;
  onDragEnter?: any;
  onDragOver?: any;
  onDragLeave?: any;
  onDragEnd?: any;
  onDrag?: any;
  onDrop?: any;
  onChange?: any;
  /**
   * 节点中替换文本，需在node节点中存在hightlightRange时可用
   */
  replace?: string;
  /**
   * 节点高度
   */
  itemLineHeight?: number;
  /**
   * 工具栏定义
   */
  actions?: TreeViewAction[];
  /**
   * 工具栏中Command执行逻辑
   */
  commandActuator?: CommandActuator;
  /**
   * 文件装饰器变化事件
   */
  notifyFileDecorationsChange?: Event<FileDecorationsProvider>;

  /**
   * 主题颜色变化事件
   */
  notifyThemeChange?: Event<ThemeProvider>;
  /**
   * 文件装饰器函数
   */
  fileDecorationProvider?: FileDecorationsProvider;
  /**
   * 主题颜色函数
   */
  themeProvider?: ThemeProvider;
}

export const defaultTreeProps: TreeProps = {
  nodes: [],
  leftPadding: 8,
};

export const TreeContainer = (
  {
    nodes = defaultTreeProps.nodes,
    leftPadding = defaultTreeProps.leftPadding,
    multiSelectable,
    onSelect,
    onTwistieClickHandler,
    onContextMenu,
    onDragStart,
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDragEnd,
    onDrag,
    onDrop,
    onChange,
    draggable,
    foldable = true,
    editable,
    replace,
    actions,
    commandActuator,
    themeProvider,
    fileDecorationProvider,
    notifyFileDecorationsChange,
    notifyThemeChange,
    itemLineHeight = 22,
    style,
  }: TreeProps,
) => {
  const [outerFocused, setOuterFocused] = React.useState<boolean>(false);
  const [outerDragOver, setOuterDragOver] = React.useState<boolean>(false);
  const [, refreshState] = React.useState<any>();

  const isEdited = editable && !!nodes!.find(<T extends TreeNode>(node: T, index: number) => {
    return !!node.filestat.isTemporaryFile;
  });

  const innerContextMenuHandler = (node, event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    const result: any = [];
    let contexts = [node];
    let isMenuActiveOnSelectedNode = false;
    if (!nodes) {
      return;
    }
    if (isEdited) {
      event.stopPropagation();
      event.preventDefault();
      return;
    }
    for (const n of nodes as SelectableTreeNode[]) {
      if (n.selected) {
        if (node.id === n.id) {
          isMenuActiveOnSelectedNode = true;
        }
        result.push(n);
      }
    }
    // 如果右键菜单在已选中的元素触发，为多选菜单
    // 否则为单选菜单
    if (isMenuActiveOnSelectedNode) {
      contexts = result;
    }
    setOuterFocused(false);
    onContextMenu(contexts, event);
  };

  const outerContextMenuHandler = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    if (isEdited) {
      return;
    }
    setOuterFocused(true);
    onContextMenu([], event);
  };

  const selectRange = (nodes: any = [], node: TreeNode) => {
    const result: any[] = [];
    let from;
    let to;
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].selected) {
        to = i;
      }
      if (node.id === nodes[i].id) {
        from = i;
        break;
      }
    }
    // 优先向下查找选中节点
    for (let j = from; j < nodes.length; j++) {
      if (nodes[j].selected) {
        to = j;
      }
    }
    // 返回从from到to之间节点
    if (from > to) {
      for (let h = to; h <= from; h++) {
        result.push(nodes[h]);
      }
    } else {
      for (let n = from; n <= to; n++) {
        result.push(nodes[n]);
      }
    }
    return result;
  };

  const toggleNode = (nodes: any = [], node: TreeNode) => {
    const result: any[] = [];
    for (const n of nodes) {
      if (node.id === n.id) {
        if (!n.selected) {
          result.push(n);
        }
      } else {
        if (n.selected) {
          result.push(n);
        }
      }
    }
    return result;
  };

  const selectNode = (node: TreeNode) => {
    return [node];
  };

  const selectHandler = (node, event) => {
    let selectedNodes: any;
    if (!node || isEdited) { return; }
    // 支持多选状态, 同时在非编辑状态时
    if (multiSelectable && !isEdited) {
      const shiftMask = hasShiftMask(event);
      const ctrlCmdMask = hasCtrlCmdMask(event);
      if (SelectableTreeNode.is(node)) {
        if (shiftMask) {
          selectedNodes = selectRange(nodes, node);
        } else if (ctrlCmdMask) {
          selectedNodes = toggleNode(nodes, node);
        } else {
          selectedNodes = selectNode(node);
        }
      }
    } else {
      selectedNodes = selectNode(node);
    }
    onSelect(selectedNodes, event);
    setOuterFocused(false);
  };

  const twistieClickHandler = (node, event) => {
    if (onTwistieClickHandler) {
      onTwistieClickHandler(node, event);
    } else {
      onSelect([node], event);
    }
  };

  const hasShiftMask = (event): boolean => {
    // Ctrl/Cmd 权重更高
    if (hasCtrlCmdMask(event)) {
      return false;
    }
    return event.shiftKey;
  };

  const hasCtrlCmdMask = (event): boolean => {
    const { metaKey, ctrlKey } = event;
    return (isOSX && metaKey) || ctrlKey;
  };

  const outerClickHandler = (event) => {
    setOuterFocused(true);
    // 让选中状态的节点失去焦点，保留选中状态
    onSelect([], event);
  };

  const outerBlurHandler = (event) => {
    setOuterFocused(false);
    setOuterDragOver(false);
  };

  const getNodeTooltip = (node: TreeNode): string | undefined => {
    if (node.tooltip) {
      return node.tooltip;
    }
    if (node.uri) {
      const uri = node.uri.toString();
      return uri ? uri : undefined;
    }
    if (node.name) {
      return node.name;
    }
  };

  const outerDropHandler = (event) => {
    onDrop('', event);
    setOuterDragOver(false);
  };

  const outerDragOverHandler = (event) => {
    event.preventDefault();
    setOuterDragOver(true);
  };

  const outerDragLeaveHandler = (event) => {
    setOuterDragOver(false);
  };

  const outerDragStartHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  React.useEffect(() => {
    if (notifyFileDecorationsChange) {
      const disposeble = notifyFileDecorationsChange(() => {
        refreshState({});
      });
      return () => {
        return disposeble.dispose();
      };
    }
  }, [notifyFileDecorationsChange]);

  React.useEffect(() => {
    if (notifyThemeChange) {
      const disposeble = notifyThemeChange(() => {
        refreshState({});
      });
      return () => {
        return disposeble.dispose();
      };
    }
  }, [notifyThemeChange]);

  return <div
    className={cls(styles.kt_treenode_container, outerFocused && styles.kt_treenode_container_focused, outerDragOver && styles.kt_treenode_all_focused)}
    style={style}
    onBlur={outerBlurHandler}
    onContextMenu={outerContextMenuHandler}
    onDrop={outerDropHandler}
    onDragStart={outerDragStartHandler}
    onDragOver={outerDragOverHandler}
    onDragLeave={outerDragLeaveHandler}
    draggable={draggable}
    onClick={outerClickHandler}
    tabIndex={0}
  >
    {
      nodes!.map(<T extends TreeNode>(node: T, index: number) => {
        if (fileDecorationProvider && themeProvider) {
          const deco: IFileDecoration = fileDecorationProvider.getDecoration(node.uri || node.name || node.id, ExpandableTreeNode.is(node));
          if (deco) {
            node = {
              ...node,
              badge: deco.badge,
              color: themeProvider.getColor({ id: deco.color }),
              tooltip: `${getNodeTooltip(node)}•${deco.tooltip}`,
            };
          }
        }
        return <TreeContainerNode
          node={node}
          leftPadding={leftPadding}
          key={`${node.id}-${index}`}
          onSelect={selectHandler}
          onTwistieClick={twistieClickHandler}
          onContextMenu={innerContextMenuHandler}
          onDragStart={onDragStart}
          onDragEnter={onDragEnter}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrag={onDrag}
          onDrop={onDrop}
          onChange={onChange}
          draggable={draggable}
          foldable={foldable}
          isEdited={isEdited}
          actions={node.actions || actions}
          replace={node.replace || replace}
          commandActuator={commandActuator}
          itemLineHeight={itemLineHeight}
        />;
      })
    }
  </div>;
};
