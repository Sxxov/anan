import type { AnimationObject } from '../../animator.types';
import type { $Object } from '../../utilities.types';

export interface LottieObject {
	// using the return object from lottie, which is a vanilla library
	animation: any;
	totalFrames: number;
	domContent: $Object;
	onFrame?: (animationObject: AnimationObject, frame: number) => void;
}
