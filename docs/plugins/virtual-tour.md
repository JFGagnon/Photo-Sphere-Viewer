# VirtualTourPlugin

::: module modules/plugin__VirtualTour.html
Create virtual tours by linking multiple panoramas.

This plugin is available in the `@photo-sphere-viewer/virtual-tour-plugin` package. **It has a stylesheet.**
:::

[[toc]]

## Usage

The plugin allows to define `nodes` which contains a `panorama` and one or more `links` to other nodes. The links are represented with a 3D arrow (default) or using the [Markers plugin](./markers.md).

There are two different ways to define the position of the links : the manual mode and the GPS mode.

:::: tabs

::: tab Manual mode
In manual mode each link must have `yaw`/`pitch` or `textureX`/`textureY` coordinates to be placed at the correct location on the panorama. This works exactly like the placement of markers.

```js
const node = {
    id: 'node-1',
    panorama: '001.jpg',
    links: [
        {
            nodeId: 'node-2',
            position: { textureX: 1500, textureY: 780 },
        },
    ],
};
```

:::

::: tab GPS mode
In GPS mode each node has positionning coordinates and the links are placed automatically.

```js
const node = {
    id: 'node-1',
    panorama: '001.jpg',
    gps: [-80.156479, 25.666725], // optional altitude as 3rd value
    links: [
        {
            nodeId: 'node-2',
            gps: [-80.156168, 25.666623], // the position of the linked node must be provided here in server mode
        },
    ],
};
```

:::

::::

The nodes can be provided all at once or asynchronously as the user navigates.

:::: tabs

::: tab Client mode
In client mode you must provide all `nodes` all at once, you can also change all the nodes with the `setNodes` method.

```js
const nodes = [
    { id: 'node-1', panorama: '001.jpg', links: [{ nodeId: 'node-2', position: { textureX: 1500, textureY: 780 } }] },
    { id: 'node-2', panorama: '002.jpg', links: [{ nodeId: 'node-1', position: { textureX: 3000, textureY: 780 } }] },
];
```

:::

::: tab Server mode
In server mode you provide the `getNode callbacks function which returns a Promise to load the data of a node.

```js
getNode = async (nodeId) => {
    const res = await fetch(`/api/nodes/${nodeId}`);
    return await res.json();
};
```

:::

::::

::: tip
If the [Gallery plugin](./gallery.md) is loaded, it will be configured with the list of nodes (client mode only).
:::

## Example

::: code-demo

```yaml
title: PSV Virtual Tour Demo
packages:
    - name: virtual-tour-plugin
      imports: VirtualTourPlugin
      style: true
    - name: gallery-plugin
      imports: GalleryPlugin
      style: true
    - name: markers-plugin
      imports: MarkersPlugin
      style: true
```

```js
const baseUrl = 'https://photo-sphere-viewer-data.netlify.app/assets/';

const viewer = new PhotoSphereViewer.Viewer({
    container: 'viewer',
    caption: 'Cape Florida Light, Key Biscayne <b>&copy; Pixexid</b>',
    loadingImg: baseUrl + 'loader.gif',
    touchmoveTwoFingers: true,
    mousewheelCtrlKey: true,
    defaultYaw: '130deg',
    navbar: 'zoom move gallery caption fullscreen',

    plugins: [
        PhotoSphereViewer.MarkersPlugin,
        [PhotoSphereViewer.GalleryPlugin, {
            thumbnailSize: { width: 100, height: 100 },
        }],
        [PhotoSphereViewer.VirtualTourPlugin, {
            positionMode: 'gps',
            renderMode: '3d',
        }],
    ],
});

const virtualTour = viewer.getPlugin(PhotoSphereViewer.VirtualTourPlugin);

virtualTour.setNodes([
    {
        id: '1',
        panorama: baseUrl + 'tour/key-biscayne-1.jpg',
        thumbnail: baseUrl + 'tour/key-biscayne-1-thumb.jpg',
        name: 'One',
        links: [{ nodeId: '2' }],
        markers: [
            {
                id: 'marker-1',
                image: baseUrl + 'pictos/pin-red.png',
                tooltip: 'Cape Florida Light, Key Biscayne',
                size: { width: 32, height: 32 },
                anchor: 'bottom center',
                position: { yaw: '105deg', pitch: '35deg' },
            },
        ],
        gps: [-80.156479, 25.666725, 3],
        panoData: { poseHeading: 327 },
    },
    {
        id: '2',
        panorama: baseUrl + 'tour/key-biscayne-2.jpg',
        thumbnail: baseUrl + 'tour/key-biscayne-2-thumb.jpg',
        name: 'Two',
        links: [{ nodeId: '3' }, { nodeId: '1' }],
        gps: [-80.156168, 25.666623, 3],
        panoData: { poseHeading: 318 },
    },
    {
        id: '3',
        panorama: baseUrl + 'tour/key-biscayne-3.jpg',
        thumbnail: baseUrl + 'tour/key-biscayne-3-thumb.jpg',
        name: 'Three',
        links: [{ nodeId: '4' }, { nodeId: '2' }, { nodeId: '5' }],
        gps: [-80.155932, 25.666498, 5],
        panoData: { poseHeading: 328 },
    },
    {
        id: '4',
        panorama: baseUrl + 'tour/key-biscayne-4.jpg',
        thumbnail: baseUrl + 'tour/key-biscayne-4-thumb.jpg',
        name: 'Four',
        links: [{ nodeId: '3' }, { nodeId: '5' }],
        gps: [-80.156089, 25.666357, 3],
        panoData: { poseHeading: 78 },
    },
    {
        id: '5',
        panorama: baseUrl + 'tour/key-biscayne-5.jpg',
        thumbnail: baseUrl + 'tour/key-biscayne-5-thumb.jpg',
        name: 'Five',
        links: [{ nodeId: '6' }, { nodeId: '3' }, { nodeId: '4' }],
        gps: [-80.156292, 25.666446, 2],
        panoData: { poseHeading: 190 },
    },
    {
        id: '6',
        panorama: baseUrl + 'tour/key-biscayne-6.jpg',
        thumbnail: baseUrl + 'tour/key-biscayne-6-thumb.jpg',
        name: 'Six',
        links: [{ nodeId: '5' }, { nodeId: '7' }],
        gps: [-80.156465, 25.666496, 2],
        panoData: { poseHeading: 328 },
    },
    {
        id: '7',
        panorama: baseUrl + 'tour/key-biscayne-7.jpg',
        thumbnail: baseUrl + 'tour/key-biscayne-7-thumb.jpg',
        name: 'Seven',
        links: [{ nodeId: '6' }],
        gps: [-80.15707, 25.6665, 3],
        panoData: { poseHeading: 250 },
    },
], '2');
```

:::

## Nodes options

#### `id` (required)

-   type: `string`

Unique identifier of the node

#### `panorama` (required)

Refer to the main [config page](../guide/config.md#panorama-required).

#### `links` (required in client mode)

-   type: `array`

Definition of the links of this node. See bellow.

#### `gps` (required in GPS mode)

-   type: `number[]`

GPS coordinates of this node as an array of two or three values (`[longitude, latitude, altitude?]`).

::: warning Projection system
Only the [ESPG:4326 projection](https://epsg.io/4326) is supported.
:::

#### `name`

-   type: `string`

Short name of this node, used in links tooltips and the gallery.

#### `caption`

Replace the global caption. Refer to the main [config page](../guide/config.md#caption).

#### `description`

Replace the global description. Refer to the main [config page](../guide/config.md#description).

#### `thumbnail`

-   type: `string`

Thumbnail for the nodes list in the gallery.

#### `markers`

-   type: `MarkerConfig[]`

Additional markers displayed on this node, requires the [Markers plugin](./markers.md).

Since 5.0.2 the markers can be positioned with the classic `position` option (yaw + pitch) or, if `positionMode=gps`, with the `gps` option (longitude + latitude + altitude).

#### `panoData`

Refer to the main [config page](../guide/config.md#panodata).

#### `sphereCorrection`

Refer to the main [config page](../guide/config.md#spherecorrection).

## Links options

#### `nodeId` (required)

-   type: `string`

Identifier of the target node.

#### `position` (required in manual mode)

-   type: `{ yaw, pitch } | { textureX, textureY }`

Position of the link in **spherical coordinates** (radians/degrees) or **texture coordinates** (pixels).

#### `gps` (required in GPS+server mode)

-   type: `number[]`

Overrides the GPS coordinates of the target node.

#### `name`

-   type: `string`

Overrides the tooltip content (defaults to the node's `name` property).

#### `arrowStyle` (3d mode only)

-   type: `object`

Overrides the global style of the arrow used to display the link. See global configuration for details.

#### `markerStyle` (markers mode only)

-   type: `object`

Overrides the global style of the marker used to display the link. See global configuration for details.

## Configuration

#### `dataMode`

-   type: `'client' | 'server'`
-   default: `'client'`

Configure how the nodes configuration is provided.

#### `positionMode`

-   type: `'manual' | 'gps'`
-   default: `'manual'`

Configure how the links between nodes are positionned.

#### `renderMode`

-   type: `'markers' | '3d'`
-   default: `'3d'`

How the links are displayed, `markers` requires the [Markers plugin](./markers.md).

#### `nodes` (client mode only)

-   type: `array`

Initial list of nodes. You can also call `setNodes` method later.

#### `getNode(nodeId)` (required in server mode)

-   type: `function(nodeId: string) => Promise<Node>`

Callback to load the configuration of a node.

#### `startNodeId`

-   type: `string`

Id of the initially loaded node. If empty the first node will be displayed. You can also call `setCurrentNode` method later.

#### `preload`

-   type: `boolean | function(node: Node, link: NodeLink) => boolean`
-   default: `false`

Enable the preloading of linked nodes, can be a function that returns true or false for each link.

#### `rotateSpeed`

-   type: `boolean | string | number`
-   default: `20rpm`

When a link is clicked, adds a animation to face it before actually changing the node. If `false` the viewer won't rotate at all and keep the current orientation.

#### `transition`

-   type: `boolean | number`
-   default: `1500`

Duration of the transition between nodes.

#### `linksOnCompass`

-   type: `boolean`
-   default: `true` if markers render mode

If the [Compass plugin](./compass.md) is enabled, displays the links on the compass.

#### `markerStyle` (markers mode only)

-   type: `object`

Style of the marker used to display links.

Default value is:

```js
{
  html     : arrowIconSvg, // an SVG provided by the plugin
  size     : { width: 80, height: 80 },
  scale    : [0.5, 2],
  anchor   : 'top center',
  className: 'psv-virtual-tour__marker',
  style : {
    color: 'rgba(0, 208, 255, 0.8)',
  },
}
```

::: tip
If you want to use another marker type like `image` you must define `html: null` to remove the default value.

```js
markerStyle: {
  html : null,
  image: 'path/to/image.png',
}
```

:::

#### `arrowStyle` (3d mode only)

-   type: `object`

Style of the arrow used to display links.

Default value is:

```js
{
  color       : 0xaaaaaa,
  hoverColor  : 0xaa5500,
  outlineColor: 0x000000,
  scale       : [0.5, 2],
}
```

(The 3D model cannot be modified).

#### `markerVerticalOffset` (markers+GPS mode only)

-   type: `number`
-   default: `-0.1`

Vertical offset in radians applied to the markers to compensate for the viewer position above ground.

#### `arrowPosition` (3d mode only)

-   type: `'top' | 'bottom'`
-   default: `'bottom'`

Vertical position of the arrows.

## Methods

#### `setNodes(nodes, [startNodeId])` (client mode only)

Changes the nodes and display the first one (or the one designated by `startNodeId`).

#### `setCurrentNode(nodeId)`

Changes the current node.

## Events

#### `node-changed(nodeId, data)`

Triggered when the current node is changed.

```js
virtualTourPlugin.addEventListener('node-changed', ({ node, data }) => {
    console.log(`Current node is ${node.id}`);
    if (data.fromNode) {
        // other data are available
        console.log(`Previous node was ${data.fromNode.id}`);
    }
});
```
