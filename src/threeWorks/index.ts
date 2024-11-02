"use client";

import * as THREE from "three";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";
import { EffectComposer, RenderPass } from "postprocessing";
import { Clouds } from "@pmndrs/vanilla";

import SceneSetup from "./SceneSetup";
import { ClientDims, randomSelect, throttle } from "./utils";

// Just for dev
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { initStars } from "./Models/Stars";
import {
  ModelAssetManager,
  HDRAssetManager,
} from "./AssetsManager/AssetManager";
import { FontManager, FontRepo } from "./Models/TextGeo";
import GlobalLoader from "./AssetsManager/GlobalLoader";
import { EventsRayCaster, initEventsModel } from "./Models/EventsModel";

// Setup Scene
SceneSetup.initialize();
ClientDims.initMouseEvent();
EventsRayCaster.init();

const UPDATE_FUNCS: (() => void)[] = [];

// Post Processing
const postRenderPass = new RenderPass(SceneSetup.scene, SceneSetup.camera);
const effectComposer = new EffectComposer(SceneSetup.renderer);
effectComposer.addPass(postRenderPass);

// Controls
// const controls = new OrbitControls(
//   SceneSetup.camera,
//   SceneSetup.renderer.domElement
// );

const nightHdr = new HDRAssetManager("/3D/hdr/night.hdr", () => {
  SceneSetup.scene.environment = nightHdr.texture;
});
GlobalLoader.pushFirst(nightHdr);

const spaceAgeFont = new FontManager("/3D/fonts/SpaceAge.json", () => {
  FontRepo.spaceAge = spaceAgeFont.font;
});
GlobalLoader.pushFirst(spaceAgeFont);

const madAdsAsset = initEventsModel("/3D/events/mad_ads.glb");
GlobalLoader.pushFirst(madAdsAsset);

let clouds: Clouds | undefined;
// initCloud().then((c) => (clouds = c));

const stars = initStars(effectComposer);

// Animation loop
function animate() {
  //   controls.update();

  UPDATE_FUNCS.forEach((f) => f());

  effectComposer.render(SceneSetup.clock.getDelta());
}

SceneSetup.renderer.setAnimationLoop(animate);

function onResize() {
  SceneSetup.update();

  madAdsAsset.updateResizeFactor();
  effectComposer.setSize(ClientDims.width, ClientDims.height);
}

const updateResize = throttle(onResize, 100);

// Global events
window.addEventListener("resize", updateResize);
