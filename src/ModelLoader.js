import * as tf from '@tensorflow/tfjs';

export async function loadModel() {
  const model = await tf.loadLayersModel('/tfjs_target_dir/model.json');
  return model;
}
