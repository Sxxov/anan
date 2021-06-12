import { CoreAnimator } from '../core.animator';
import type { AnimationObject } from '../types/animation.object';
import type { $Object } from '../../utilities/types/$.object';
import { $ } from '../../utilities/$.utility';

type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends Record<string, unknown> ? DeepPartial<T[P]> : T[P];
};

export class AnimationFactory {
	private ctx: CoreAnimator;

	public constructor(thisArg: CoreAnimator) {
		this.ctx = thisArg;
	}

	create(options: DeepPartial<AnimationObject>): AnimationObject {
		const baseObject: AnimationObject = {
			data: undefined,
			...options,
		} as any;

		const baseItemsObject: AnimationObject['items'] = {
			__caller: this.ctx.constructor,
			__container: options.type === 'null' || options.type === 'meta' ? null : this.createAndReturnNewContainerDom(options),
			__framesBeforeCurrent: this.ctx.getTotalFramesBeforeIndex(options.index || 0),
			uid: Math.round(performance.now()).toString(),
			domContent: null,
			offset: 0,
			disabled: false,
			object: {},
			respectDevicePixelRatio: true,
			totalFrames: null,
			bezier: [
				0,
				0,
				1,
				1,
			],
			height: {
				maximum: null,
				minimum: null,
			} as any,
			width: {
				maximum: null,
				minimum: null,
			} as any,
			onFrame: (): void => {},
			onVisible: (): void => {},
			onHidden: (): void => {},
			onRedraw: (): void => {},
			...options.items,
		} as any;

		return {
			...baseObject,
			items: baseItemsObject,
		};
	}

	private createAndReturnNewContainerDom(animationObject: DeepPartial<AnimationObject>): $Object {
		const animatorContainer = $(document.createElement('div'));

		animatorContainer.addClass([
			CoreAnimator.PREFIX,
			'container',
			Math.round(performance.now()).toString(),
		]);

		if (animationObject
			.items
			?.invert === true) {
			animatorContainer.addClass('invert');
		}

		CoreAnimator.activate(animatorContainer);

		this.ctx.animatorContainersWrapper.appendChild(animatorContainer);

		this.ctx.animatorContainers.push(animatorContainer);

		return animatorContainer;
	}
}
