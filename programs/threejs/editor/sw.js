// r139

const cacheName = 'threejs-editor';

const assets = [
	'./',

	'./manifest.json',
	'./images/icon.png',

	'../files/favicon.ico',

	'../build/three.module.js',

	'../player/jsm/controls/TransformControls.js',

	'../player/jsm/libs/chevrotain.module.min.js',
	'../player/jsm/libs/fflate.module.js',

	'../player/js/libs/draco/draco_decoder.js',
	'../player/js/libs/draco/draco_decoder.wasm',
	'../player/js/libs/draco/draco_encoder.js',
	'../player/js/libs/draco/draco_wasm_wrapper.js',

	'../player/js/libs/draco/gltf/draco_decoder.js',
	'../player/js/libs/draco/gltf/draco_decoder.wasm',
	'../player/js/libs/draco/gltf/draco_wasm_wrapper.js',

	'../player/jsm/libs/motion-controllers.module.js',

	'../player/jsm/libs/rhino3dm/rhino3dm.wasm',
	'../player/jsm/libs/rhino3dm/rhino3dm.js',

	'../player/jsm/loaders/3DMLoader.js',
	'../player/jsm/loaders/3MFLoader.js',
	'../player/jsm/loaders/AMFLoader.js',
	'../player/jsm/loaders/ColladaLoader.js',
	'../player/jsm/loaders/DRACOLoader.js',
	'../player/jsm/loaders/FBXLoader.js',
	'../player/jsm/loaders/GLTFLoader.js',
	'../player/jsm/loaders/KMZLoader.js',
	'../player/jsm/loaders/IFCLoader.js',
	'../player/jsm/loaders/ifc/web-ifc-api.js',
	'../player/jsm/loaders/ifc/web-ifc.wasm',
	'../player/jsm/loaders/MD2Loader.js',
	'../player/jsm/loaders/OBJLoader.js',
	'../player/jsm/loaders/MTLLoader.js',
	'../player/jsm/loaders/PLYLoader.js',
	'../player/jsm/loaders/RGBELoader.js',
	'../player/jsm/loaders/STLLoader.js',
	'../player/jsm/loaders/SVGLoader.js',
	'../player/jsm/loaders/TGALoader.js',
	'../player/jsm/loaders/TDSLoader.js',
	'../player/jsm/loaders/VOXLoader.js',
	'../player/jsm/loaders/VRMLLoader.js',
	'../player/jsm/loaders/VTKLoader.js',
	'../player/jsm/loaders/XYZLoader.js',

	'../player/jsm/curves/NURBSCurve.js',
	'../player/jsm/curves/NURBSUtils.js',

	'../player/jsm/interactive/HTMLMesh.js',
	'../player/jsm/interactive/InteractiveGroup.js',

	'../player/jsm/environments/RoomEnvironment.js',

	'../player/jsm/exporters/ColladaExporter.js',
	'../player/jsm/exporters/DRACOExporter.js',
	'../player/jsm/exporters/GLTFExporter.js',
	'../player/jsm/exporters/OBJExporter.js',
	'../player/jsm/exporters/PLYExporter.js',
	'../player/jsm/exporters/STLExporter.js',
	'../player/jsm/exporters/USDZExporter.js',

	'../player/jsm/helpers/VertexNormalsHelper.js',

	'../player/jsm/geometries/TeapotGeometry.js',

	'../player/jsm/webxr/VRButton.js',
	'../player/jsm/webxr/XRControllerModelFactory.js',

	'./images/rotate.svg',
	'./images/scale.svg',
	'./images/translate.svg',

	'./js/libs/codemirror/codemirror.css',
	'./js/libs/codemirror/theme/monokai.css',

	'./js/libs/codemirror/codemirror.js',
	'./js/libs/codemirror/mode/javascript.js',
	'./js/libs/codemirror/mode/glsl.js',

	'./js/libs/esprima.js',
	'./js/libs/jsonlint.js',

	'./js/libs/codemirror/addon/dialog.css',
	'./js/libs/codemirror/addon/show-hint.css',
	'./js/libs/codemirror/addon/tern.css',

	'./js/libs/codemirror/addon/dialog.js',
	'./js/libs/codemirror/addon/show-hint.js',
	'./js/libs/codemirror/addon/tern.js',
	'./js/libs/acorn/acorn.js',
	'./js/libs/acorn/acorn_loose.js',
	'./js/libs/acorn/walk.js',
	'./js/libs/ternjs/polyfill.js',
	'./js/libs/ternjs/signal.js',
	'./js/libs/ternjs/tern.js',
	'./js/libs/ternjs/def.js',
	'./js/libs/ternjs/comment.js',
	'./js/libs/ternjs/infer.js',
	'./js/libs/ternjs/doc_comment.js',
	'./js/libs/tern-threejs/threejs.js',

	'./js/libs/signals.min.js',
	'./js/libs/ui.js',
	'./js/libs/ui.three.js',

	'./js/libs/app.js',
	'./js/Player.js',
	'./js/Script.js',

	//

	'./css/main.css',

	'./js/EditorControls.js',
	'./js/Storage.js',

	'./js/Editor.js',
	'./js/Config.js',
	'./js/History.js',
	'./js/Loader.js',
	'./js/LoaderUtils.js',
	'./js/Menubar.js',
	'./js/Menubar.File.js',
	'./js/Menubar.Edit.js',
	'./js/Menubar.Add.js',
	'./js/Menubar.Play.js',
	'./js/Menubar.Examples.js',
	'./js/Menubar.Help.js',
	'./js/Menubar.View.js',
	'./js/Menubar.Status.js',
	'./js/Resizer.js',
	'./js/Sidebar.js',
	'./js/Sidebar.Scene.js',
	'./js/Sidebar.Project.js',
	'./js/Sidebar.Project.Materials.js',
	'./js/Sidebar.Project.Renderer.js',
	'./js/Sidebar.Project.Video.js',
	'./js/Sidebar.Settings.js',
	'./js/Sidebar.Settings.History.js',
	'./js/Sidebar.Settings.Shortcuts.js',
	'./js/Sidebar.Settings.Viewport.js',
	'./js/Sidebar.Properties.js',
	'./js/Sidebar.Object.js',
	'./js/Sidebar.Geometry.js',
	'./js/Sidebar.Geometry.BufferGeometry.js',
	'./js/Sidebar.Geometry.Modifiers.js',
	'./js/Sidebar.Geometry.BoxGeometry.js',
	'./js/Sidebar.Geometry.CircleGeometry.js',
	'./js/Sidebar.Geometry.CylinderGeometry.js',
	'./js/Sidebar.Geometry.DodecahedronGeometry.js',
	'./js/Sidebar.Geometry.ExtrudeGeometry.js',
	'./js/Sidebar.Geometry.IcosahedronGeometry.js',
	'./js/Sidebar.Geometry.LatheGeometry.js',
	'./js/Sidebar.Geometry.OctahedronGeometry.js',
	'./js/Sidebar.Geometry.PlaneGeometry.js',
	'./js/Sidebar.Geometry.RingGeometry.js',
	'./js/Sidebar.Geometry.SphereGeometry.js',
	'./js/Sidebar.Geometry.ShapeGeometry.js',
	'./js/Sidebar.Geometry.TetrahedronGeometry.js',
	'./js/Sidebar.Geometry.TorusGeometry.js',
	'./js/Sidebar.Geometry.TorusKnotGeometry.js',
	'./js/Sidebar.Geometry.TubeGeometry.js',
	'./js/Sidebar.Geometry.TeapotGeometry.js',
	'./js/Sidebar.Material.js',
	'./js/Sidebar.Material.BooleanProperty.js',
	'./js/Sidebar.Material.ColorProperty.js',
	'./js/Sidebar.Material.ConstantProperty.js',
	'./js/Sidebar.Material.MapProperty.js',
	'./js/Sidebar.Material.NumberProperty.js',
	'./js/Sidebar.Material.Program.js',
	'./js/Sidebar.Animation.js',
	'./js/Sidebar.Script.js',
	'./js/Strings.js',
	'./js/Toolbar.js',
	'./js/Viewport.js',
	'./js/Viewport.Camera.js',
	'./js/Viewport.Info.js',
	'./js/Viewport.ViewHelper.js',
	'./js/Viewport.VR.js',

	'./js/Command.js',
	'./js/commands/AddObjectCommand.js',
	'./js/commands/RemoveObjectCommand.js',
	'./js/commands/MoveObjectCommand.js',
	'./js/commands/SetPositionCommand.js',
	'./js/commands/SetRotationCommand.js',
	'./js/commands/SetScaleCommand.js',
	'./js/commands/SetValueCommand.js',
	'./js/commands/SetUuidCommand.js',
	'./js/commands/SetColorCommand.js',
	'./js/commands/SetGeometryCommand.js',
	'./js/commands/SetGeometryValueCommand.js',
	'./js/commands/MultiCmdsCommand.js',
	'./js/commands/AddScriptCommand.js',
	'./js/commands/RemoveScriptCommand.js',
	'./js/commands/SetScriptValueCommand.js',
	'./js/commands/SetMaterialCommand.js',
	'./js/commands/SetMaterialColorCommand.js',
	'./js/commands/SetMaterialMapCommand.js',
	'./js/commands/SetMaterialValueCommand.js',
	'./js/commands/SetMaterialVectorCommand.js',
	'./js/commands/SetSceneCommand.js',
	'./js/commands/Commands.js',

	//

	'./examples/arkanoid.app.json',
	'./examples/camera.app.json',
	'./examples/particles.app.json',
	'./examples/pong.app.json',
	'./examples/shaders.app.json'

];

self.addEventListener( 'install', async function () {

	const cache = await caches.open( cacheName );

	assets.forEach( function ( asset ) {

		cache.add( asset ).catch( function () {

			console.warn( '[SW] Cound\'t cache:', asset );

		} );

	} );

} );

self.addEventListener( 'fetch', async function ( event ) {

	const request = event.request;
	event.respondWith( networkFirst( request ) );

} );

async function networkFirst( request ) {

	return fetch( request )
		.then( async function ( response ) {

			const cache = await caches.open( cacheName );

			cache.put( request, response.clone() );

			return response;

		} )
		.catch( async function () {

			const cachedResponse = await caches.match( request );

			if ( cachedResponse === undefined ) {

				console.warn( '[SW] Not cached:', request.url );

			}

			return cachedResponse;

		} );

}
