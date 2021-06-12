import { CoreAnimator } from '../../animators';
import { $ } from '../../utilities';
import type {
	SolidObject,
	AnimationObject,
} from '../../animator.types';
import type { $Object } from '../../utilities.types';

export class SolidFactory {
	private ctx: CoreAnimator;

	public constructor(thisArg: CoreAnimator) {
		this.ctx = thisArg;
	}

	public async create(animationObject: AnimationObject): Promise<SolidObject> {
		const {
			uid,
			__container,
		} = animationObject.items;

		const className = uid;
		const domContent = this.createAndReturnDomContent(className);

		__container?.appendChild(domContent);

		const solidObject: SolidObject = {
			domContent,
		};

		return solidObject;
	}

	// eslint-disable-next-line class-methods-use-this
	private createAndReturnDomContent(className: string): $Object {
		const domContent = $(document.createElement('div'));

		domContent.css({
			width: '100vw',
			height: '100vh',
			background: 'white',
			position: 'absolute',
		});

		domContent.addClass([
			CoreAnimator.PREFIX,
			'solid',
			className,
			'hidden',
		]);

		return domContent;
	}
}
