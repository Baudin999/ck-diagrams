import { NumericLiteral, formatDiagnostic } from "typescript";

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
    rank: number = 0;
    laneRank: number = 0;
    laneTop: number = 30;
    laneFooter: number = 10;

    constructor(originalNodes: INodeDefinition[]) {
        this.originalNodes = originalNodes;
        this.originalNodes.unshift({ id: "start", label: "Start", type: "start" });
        this.originalNodes = originalNodes;
        this.originalNodes.push({ id: "stop", label: "Stop", type: "stop" });

        this.parseLanes(this.originalNodes);
        this.parseNodes(this.originalNodes, true);
        this.parseEdges(this.nodes);
        this.calculateDimentions();

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
            let key = node.in?.toLowerCase() || "default";
            let lane = this._lanes[key];
            let n = this.creatNode(node, lane);
            this.rank++;

            lane.nodes.push(n);
            if (push) this.nodes.push(n);

            if (node.nodes && node.nodes.length > 0) {
                n.nodes = this.parseNodes(node.nodes, false);
            }

            return n;
        });


    }

    private parseEdges(ns: INode[], _to?: INode) {
        var rank = 0;
        var exit = ns[ns.length - 1];
        for (let i = ns.length; i > 0; --i) {
            let from = ns[i - 1];
            let to = ns[i];

            if (from.type === NodeTypes.Choice) {

                var root = from.nodes[0];
                from.nodes.forEach(child => {
                    child.y = root.y;
                    var postions = this.calculatePostions(child);
                    child.top = postions.top;
                    child.right = postions.right;
                    child.bottom = postions.bottom;
                    child.left = postions.left;

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

        this.lanes = lanes;
        this.height = height;
        this.width = this.lanes.length * 200;
    }

    private creatNode(n: INodeDefinition, lane: ILane): INode {
        let x = 0; //lane.x;
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
            top: { x: width / 2 + x + lane.x, y: 0 + y + padding },
            right: { x: width + x - padding + lane.x, y: height / 2 + y },
            bottom: { x: width / 2 + x + lane.x, y: height + y - padding },
            left: { x: 0 + x + padding + lane.x, y: height / 2 + y },
            type: parseType(n.type),
            in: n.in,
            nodes: [],
            rank: lane.nodes.length,
            lane
        };
    }

    private calculatePostions(n: INode) {
        return {
            top: { x: n.width / 2 + n.x + n.lane.x, y: 0 + n.y + n.padding },
            right: { x: n.width + n.x - n.padding + n.lane.x, y: n.height / 2 + n.y },
            bottom: { x: n.width / 2 + n.x + n.lane.x, y: n.height + n.y - n.padding },
            left: { x: 0 + n.x + n.padding + n.lane.x, y: n.height / 2 + n.y },
        };
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
            nodes: []
        };
    }

    private createLine(p1: IPoint, p2: IPoint): IEdge {
        let id = Math.random().toString(36).substring(7);
        let otherPoinst = [];
        if (p1.x !== p2.x) {
            let y = p1.y + ((p2.y - p1.y) / 2);
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
    id: "___"
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