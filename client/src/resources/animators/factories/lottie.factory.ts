import type { LottiePlayer } from 'lottie-web';
import { CoreAnimator } from '../../animators';
import type { AnimationObject } from '../types/animation.object';
import type { LottieObject } from '../types/lottie.object';
import { $ } from '../../utilities/$.utility';
import { UnexpectedValueError } from '../../../../../common/src/resources/errors/unexpectedValue.error';

export class LottieFactory {
	private ctx: CoreAnimator;

	public constructor(thisArg: CoreAnimator) {
		this.ctx = thisArg;
	}

	public async create(animationObject: AnimationObject): Promise<LottieObject> {
		const lottie: LottiePlayer = await import('lottie-web') as any;

		if (animationObject.items.__container == null) {
			throw new UnexpectedValueError('`__container` is nullish');
		}

		const className = animationObject.items.uid;
		const animation = lottie.loadAnimation({
			container: animationObject.items.__container,
			renderer: 'canvas',
			loop: true,
			autoplay: true,
			animationData: animationObject.data,
			rendererSettings: {
				dpr: animationObject.items.respectDevicePixelRatio === false
					? 1
					: this.ctx.dpr * this.ctx.resolutionMultiplier,
				preserveAspectRatio: 'xMidYMid slice',
				className: `${CoreAnimator.PREFIX} ${className} hidden`,
			} as any,
		});

		if (!animation) {
			await new Promise((resolve) => $(animation).on('DOMLoaded', () => resolve));
		}

		const domContent = $(`.${className}`);
		const totalFrames = (
			animationObject.items.totalFrames
			|| animation.getDuration(true)
		);
		const onFrame = (animationItem: AnimationObject, frame: number): void => {
			animationItem
				.items
				.object
				?.lottie
				?.animation
				.goToAndStop(
					frame,
					true,
				);
		};

		const lottieObject: LottieObject = {
			animation,
			totalFrames,
			domContent,
			onFrame,
		};

		lottieObject.animation.goToAndStop(-1, true);

		this.onLottieObjectCreated(lottieObject);

		return lottieObject;
	}

	// eslint-disable-next-line class-methods-use-this
	private onLottieObjectCreated(lottieObject: LottieObject): void {
		const lottieObjectDom = lottieObject.domContent;

		lottieObjectDom.css({
			width: '',
			height: '',
			position: 'absolute',
		});

		(lottieObjectDom as unknown as HTMLCanvasElement).width = 1;
		(lottieObjectDom as unknown as HTMLCanvasElement).height = 1;
	}
}
