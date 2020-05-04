import { NumericLiteral, formatDiagnostic } from "typescript";
import { fix_and_outro_and_destroy_block } from "svelte/internal";

let rankHeight = 100;
let nodeHeight = 80;
let laneWidth = 200;

export class Layout {
    public nodes: INode[] = [];
    public edges: IEdge[] = [];
    public lanes: ILane[] = [];
    private _lanes: object = {};
    private originalNodes: INodeDefinition[];
    private context: INode[] = [];
    x: number;
    y: number;
    width: number;
    height: number;
    rank: number = -1;
    laneRank: number = 0;
    laneTop: number = 30;
    laneFooter: number = 10;

    constructor(originalNodes: INodeDefinition[]) {
        this.originalNodes = originalNodes;
        this.originalNodes.unshift({ id: "start", label: "Start", type: "start" });
        this.originalNodes = originalNodes;
        var endIn = originalNodes[originalNodes.length - 1].in;
        this.originalNodes.push({ id: "stop", label: "Stop", type: "stop", in: endIn });

        this.parseLanes(this.originalNodes);
        this.parseNodes(this.originalNodes, true);
        this.positionNodes(this.nodes);
        this.parseEdges(this.nodes);
        this.calculateDimentions();

        console.log(this._lanes)

        this.x = 0;
        this.y = 0;
    }

    private parseLanes(ns: INodeDefinition[]) {
        ns.forEach((node, i) => {
            let key = node.in?.toLowerCase() || "default";
            let lane = this._lanes[key];

            if (!lane) {
                lane = this.createLane(key, node?.in || "Default");
                this.laneRank += 1;
                this._lanes[key] = lane;
            }

            if (node.nodes && node.nodes.length > 0) this.parseLanes(node.nodes);
        });
    }

    private parseNodes(ns: INodeDefinition[], push: boolean): INode[] {
        return ns.map((node, i) => {
            this.rank++;
            let key = node.in?.toLowerCase() || "default";
            let lane = this._lanes[key];
            let n = this.creatNode(node, lane);

            if (push) this.nodes.push(n);


            // sort the nodes 
            var defs = (node.nodes || []).sort((a, b) => (a.nodes || []).length - (b.nodes || []).length);

            if (n.type === NodeTypes.Choice) {

                var r = defs.map(d => {
                    var result = this.parseNodes([d], false);
                    this.rank--;
                    return result[0];
                });
                n.nodes = r;

                let indexes = {};
                let y = n.nodes[0].y;

                n.nodes.forEach((_node, i) => {

                    if (!indexes[_node.lane.id]) {
                        indexes[_node.lane.id] = 1;
                        _node.rank = 0;
                    }
                    else {
                        indexes[_node.lane.id]++;
                        _node.rank = indexes[_node.lane.id] - 1;
                        _node.lane.width += laneWidth;

                        Object
                            .keys(this._lanes)
                            .map(key => this._lanes[key])
                            .filter(l => l.index > _node.lane.index)
                            .forEach(l => l.x += laneWidth);
                    }

                    _node.y = y;
                    _node.x = (indexes[_node.lane.id] - 1) * laneWidth + _node.lane.x;
                });
                this.rank++;
            }
            else {
                n.nodes = this.parseNodes(defs, false);
            }

            return n;
        });

    }

    private positionNodes(nodes: INode[]) {
        nodes.forEach(n => {
            n.x = n.lane.x + (n.rank * laneWidth);
            var { top, right, bottom, left } = this.calculatePostions(n);
            n.top = top;
            n.right = right;
            n.bottom = bottom;
            n.left = left;
            this.positionNodes(n.nodes);
        })
    }

    private parseEdges(ns: INode[], _to?: INode) {
        var rank = 0;
        var exit = ns[ns.length - 1];
        for (let i = ns.length; i > 0; --i) {
            let from = ns[i - 1];
            let to = ns[i];

            if (from.type === NodeTypes.Choice) {

                from.nodes.forEach(child => {

                    this.edges.push(this.createLine(from.bottom, child.top));

                    if (child.nodes && child.nodes.length > 0) {
                        exit = this.parseEdges(child.nodes, to);
                        if (to && exit.nodes.length == 0) this.edges.push(this.createLine(exit.bottom, to.top));
                        this.edges.push(this.createLine(child.bottom, child.nodes[0].top));
                    }
                    else {
                        this.edges.push(this.createLine(child.bottom, (_to || to).top));
                    }
                });
            } else {
                if (to) this.edges.push(this.createLine(from.bottom, to.top));

            }
        }

        return exit;
    }

    private moveNodes(nodes: INode[], laneId: string) {
        nodes
            .filter(n => n.lane.id !== laneId)
            .forEach(n => {
                n.x += laneWidth;
                this.moveNodes(n.nodes, laneId);
            });
    }

    private calculateDimentions() {
        let rank = 0;
        let height;

        let lanes = Object
            .keys(this._lanes)
            .map(key => this._lanes[key] as ILane)
            .map(lane => {
                if (lane.nodes.length > rank) {
                    // rank = lane.nodes.length;
                    height = this.rank * rankHeight + this.laneFooter + this.laneTop
                }
                return lane;
            })
            .map(lane => {
                lane.height = height;
                return lane;
            });

        this.height = this.nodes.reduce((height, next) => {
            if (next.y + next.height > height) return height = next.y + next.height;
            else return height;
        }, 0)

        this.lanes = lanes;
        this.width = this.lanes.reduce((acc, lane) => lane.width + acc, 0);
    }

    private creatNode(n: INodeDefinition, lane: ILane): INode {
        let x = lane.x;
        let y = lane.rankHeight * this.rank + lane.laneTop;
        let width = lane.width;
        let height = nodeHeight;
        let type = parseType(n.type);
        let padding = 10;

        if (type === NodeTypes.Start || type === NodeTypes.Stop) {
            height = 30 + 2 * padding;
        }

        return {
            id: n.id,
            label: n.label,
            x,
            y,
            width,
            height,
            padding,
            margin: 0,
            top: { x: width / 2 + x, y: 0 + y + padding },
            right: { x: width + x - padding, y: height / 2 + y },
            bottom: { x: width / 2 + x, y: height + y - padding },
            left: { x: 0 + x + padding, y: height / 2 + y },
            type: parseType(n.type),
            in: n.in,
            nodes: [],
            rank: lane.nodes.length,
            lane,
            row: this.rank
        };
    }

    private calculatePostions(n: INode) {
        if (n.type === "database") {
            return {
                top: { x: n.width / 2 + n.x, y: -5 + n.y + n.padding },
                right: { x: n.width + n.x - n.padding, y: n.height / 2 + n.y },
                bottom: { x: n.width / 2 + n.x, y: n.height + n.y - n.padding },
                left: { x: 0 + n.x + n.padding, y: n.height / 2 + n.y },
            };
        }
        else {
            return {
                top: { x: n.width / 2 + n.x, y: 0 + n.y + n.padding },
                right: { x: n.width + n.x - n.padding, y: n.height / 2 + n.y },
                bottom: { x: n.width / 2 + n.x, y: n.height + n.y - n.padding },
                left: { x: 0 + n.x + n.padding, y: n.height / 2 + n.y },
            };
        }
    }

    private createLane(id: string, label: string): ILane {

        let x = this.laneRank * laneWidth;
        return {
            index: Object.keys(this._lanes).length,
            id,
            label,
            width: laneWidth,
            height: 0,
            x,
            laneTop: this.laneTop,
            laneFooter: this.laneFooter,
            rankHeight,
            nodes: [],
            rank: 0
        };
    }

    private createLine(p1: IPoint, p2: IPoint): IEdge {
        let id = Math.random().toString(36).substring(7);
        let otherPoinst = [];
        if (p1.x !== p2.x) {
            let y = p2.y - 20;
            otherPoinst.push({ x: p1.x, y });
            otherPoinst.push({ x: p2.x, y });
        }
        return { id, label: "", points: [p1, ...otherPoinst, p2] };
    }
}

const defaultLane: ILane = {
    rankHeight,
    laneTop: 30,
    laneFooter: 10,
    index: 0,
    height: 0,
    label: "",
    width: laneWidth,
    x: 0,
    nodes: [],
    id: "___",
    rank: 0
}

const parseType = t => {
    if (t === "start") {
        return NodeTypes.Start;
    }
    else if (t === "stop") {
        return NodeTypes.Stop;
    }
    else if (t === "choice") {
        return NodeTypes.Choice;
    }
    else if (t === "database") {
        return NodeTypes.Database;
    }
    else if (t === "subprocess") {
        return NodeTypes.Subprocess;
    }
    else {
        return NodeTypes.Normal;
    }
}

enum NodeTypes {
    Start = "start",
    Stop = "stop",
    Subprocess = "subprocess",
    Database = "database",
    Normal = "normal",
    Choice = "choice"
}

interface IEdge {
    id: string;
    label: string;
    points: IPoint[];
}

export interface ILane {
    id: string;
    label: string;
    index: number;
    width: number;
    height: number;
    x: number;
    laneTop: number;
    laneFooter: number;
    rankHeight: number;
    rank: number;
    nodes: INode[];
}

interface INode {
    id: string;
    label: string;
    in: string;
    type: NodeTypes;

    x: number;
    y: number;
    width: number;
    height: number;
    padding: number;
    margin: number;

    rank: number;

    top: IPoint;
    right: IPoint;
    bottom: IPoint;
    left: IPoint;

    nodes?: INode[];
    lane: ILane;
    row: number;
}


interface IPoint {
    x: number;
    y: number;
}


interface INodeDefinition {
    id: string;
    label: string;
    type?: string;
    in?: string;
    nodes?: INodeDefinition[];
    value?: any;
}

function findWithAttr<T>(array: T[], predicate): { index: number, o: T } | null {
    for (var i = 0; i < array.length; i += 1) {
        if (predicate(array[i])) return { index: i, o: array[i] };
    }
    return null;
}


Array.prototype.peek = function () {
    return this.length > 0 ? this[this.length - 1] : null;
}


/*
this.nodes.push(n);
            if (previousNode && !this.context.peek()) {
                this.edges.push(this.createLine(previousNode.bottom, n.top));
            }
            previousNode = n;
            if (node.nodes && node.type === NodeTypes.Choice) {
                this.context.push(n);
                let prev = this.context.peek();
                this.parseNodes(node.nodes).forEach(child => {
                    this.edges.push(this.createLine(prev.bottom, child.top));
                });
                this.context.pop();
            }
            else if (node.nodes) {
                // let prev = this.context.peek();
                // this.parseNodes(node.nodes).forEach(child => {
                //     this.edges.push(this.createLine(prev.bottom, child.top));
                // });
            }
*/