<script lang='ts'>
	import Image from '../blocks/Image.svelte';
	import type { TopicItem } from '../../../../common/src/core/items/topic.item';
	import { CaseUtility } from '../../resources/utilities/case.utility';
	import Card from '../blocks/Card.svelte';
	import Spacer from '../blocks/Spacer.svelte';
	import { RandomUtility } from '../../resources/utilities';

	export let contact: TopicItem['contact'];
	export let content: TopicItem['content'];

	const ContactImageSrcs: Record<typeof contact, string[]> = {
		mother: ['https://raw.githubusercontent.com/Sxxov/picgo-dump/upload/_/1623492254817-maria-lupan-Omae6x2qFTU-unsplash.webp'],
		aunt: ['https://raw.githubusercontent.com/Sxxov/picgo-dump/upload/_/1623492254816-bbh-singapore-Z2MCFqEQiMw-unsplash.webp'],
		brother: ['https://raw.githubusercontent.com/Sxxov/picgo-dump/upload/_/1623492254817-mubariz-mehdizadeh-Py8F6-hRn5o-unsplash.webp'],
		father: ['https://raw.githubusercontent.com/Sxxov/picgo-dump/upload/_/1623492277773-luke-southern-yyvx_eYqtKY-unsplash.webp'],
		uncle: ['https://raw.githubusercontent.com/Sxxov/picgo-dump/upload/_/1623492254817-mohammed-hassan-pfUmis9uGdk-unsplash.webp'],
	};

	function getRandom<T>(array: T[]) {
		console.log('src:', array[Math.floor(Math.random() * array.length)]);

		return array[Math.floor(Math.random() * array.length)];
	}
</script>
<component>
	<container
		class='text wrapper'
	>
		<heading>
			{CaseUtility.title(contact)}.
		</heading>
		<!-- <Spacer
			height={18}
		/> -->
		<sstring>
			<icon style='font-size: 0.7rem;'>call</icon>&nbsp;&nbsp;01{RandomUtility.int(1)}-{RandomUtility.int(4)}-{RandomUtility.int(4)} &nbsp;&nbsp;&nbsp;
		</sstring>
		<sstring
			class='text content'
		>
			Calling about {content}.
		</sstring>
		<Spacer
			height={48}
		/>
	</container>
	<Card
		isPadded={false}
		isFloatingInverted={true}
		roundness='100%'
		width='min-content'
	>
		<container
			class='image wrapper'
		>
			<container
				class='image border'
			/>
			<Image
				height='200px'
				width='200px'
				roundness='100%'
				src={getRandom(ContactImageSrcs[contact])}
				alt={`Fake contact person (${CaseUtility.title(contact)})`}
			/>
		</container>
	</Card>
</component>

<style>
	component {
		display: grid;
		align-items: center;
		justify-items: center;
	}

	heading {
		word-break: break-all;
    	text-align: center;
	}

	container.image.wrapper {
		transform: matrix(1, 0, 0, 1, 0, 0);
	}

	container.image.border {
		--border-width: 2px;

		opacity: 0.2;

		position: absolute;
		top: calc(var(--border-width) * -1);
		left: calc(var(--border-width) * -1);
		border-radius: 100%;
		height: calc(200px + (var(--border-width) * 2));
		width: calc(200px + (var(--border-width) * 2));
		background: var(--colour-text-primary);	

		transition: all 0.3s var(--ease-slow-slow);
	}

	container.text.wrapper {
		display: grid;
		justify-items: center;
		align-items: center;

		max-width: 200px;
	}

	sstring.content {
    	text-align: center;
		opacity: 0.7;
	}
</style>
