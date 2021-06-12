<script context='module' lang='ts'>
	/* eslint-disable array-bracket-newline, array-element-newline */
	const Emojis = ['😀', '😃', '😄', '😁', '😆', '🤩', '😅', '😂', '🤣', '☺️', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '😘', '😗', '😙', '😚', '😋', '🤪', '😜', '😝', '😛', '🤑', '🤗', '🤓', '😎', '🤡', '🤠', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '😤', '😠', '😡', '🤬', '😶', '😐', '😑', '😯', '😦', '😧', '😮', '😲', '😵', '🤯', '😳', '😱', '😨', '😰', '😢', '😥', '🤤', '😭', '😓', '😪', '😴', '🥱', '🙄', '🤨', '🧐', '🤔', '🤫', '🤭', '🤥', '😬', '🤐', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '😈', '👿', '👹', '👺', '💩', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '👐', '🙌', '👏', '🙏', '🤲', '🤝', '👍', '👎', '👊', '✊', '🤛', '🤜', '🤞', '✌️', '🤘', '🤏', '👌', '👈', '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐', '🖖', '👋', '🤙', '💪', '🖕', '🤟', '✍️', '🤳', '💅', '🖖', '💄', '💋', '👄', '👅', '👂', '🦻', '👃', '🦵', '🦶', '🦾', '🦿', '👣', '👁', '👀', '🗣', '👤', '👥', '👶', '👦', '👧', '🧒', '👨', '👩', '🧑', '', '🦰', '🦱', '🦲', '🦳', '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙊', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦩', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐚', '🦗', '🐞', '🐜', '🕷', '🕸', '🐢', '🐍', '🦎', '🦂', '🦀', '🦑', '🐙', '🦐', '🐠', '🐟', '🐡', '🐬', '🦈', '🐳', '🐋', '🐊', '🐆', '🐅', '🐃', '🐂', '🐄', '🦌', '🐪', '🐫', '🐘', '🦏', '🦍', '🐎', '🐖', '🐐', '🐏', '🐑', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐓', '🦃', '🕊', '🐇', '🐁', '🐀', '🐿', '🦓', '🦒', '🦔', '🦧', '🦥', '🦦', '🦨', '🦕', '🦖', '🦪', '🐾', '🐉', '🐲', '🌵', '🎄', '🌲', '🌳', '🌴', '🌱', '🌿', '☘️', '🍀', '🎍', '🎋', '🍃', '🍂', '🍁', '🍄', '🌾', '💐', '🌷', '🌹', '🥀', '🌻', '🌼', '🌸', '🌺', '🌎', '🌍', '🌏', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌚', '🌝', '🌞', '🌛', '🌜', '🌙', '🪐', '💫', '⭐️', '🌟', '✨', '⚡️', '🔥', '💥', '☄️', '☀️', '🌤', '⛅️', '🌥', '🌦', '🌈', '☁️', '🌧', '⛈', '🌩', '🌨', '☃️', '⛄️', '❄️', '🌬', '💨', '🌪', '🌫', '🌊', '💧', '💦', '☔️', '🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🍍', '🥝', '🥑', '🍅', '🍆', '🥒', '🥕', '🌽', '🌶', '🧄', '🧅', '🥔', '🍠', '🌰', '🥜', '🍯', '🥐', '🍞', '🥖', '🧀', '🥚', '🍳', '🥓', '🥞', '🍤', '🍗', '🍖', '🍕', '🌭', '🍔', '🍟', '🥙', '🌮', '🌯', '🥗', '🥘', '🍝', '🍜', '🍲', '🍥', '🍣', '🍱', '🍛', '🍚', '🍙', '🍘', '🍢', '🍡', '🍧', '🍨', '🍦', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🥛', '🍼', '☕️', '🍵', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🍾', '🧃', '🧉', '🧊', '🥄', '🍴', '🍽', '🥥', '🥨', '🥩', '🥪', '🥣', '🥫', '🧇', '🧆', '🧈', '🥟', '🥠', '🥡', '🥧', '🥤', '🥢', '⚽️', '🏀', '🏈', '⚾️', '🎾', '🏐', '🏉', '🎱', '🏓', '🏸', '🥅', '🏒', '🏑', '🏏', '⛳️', '🏹', '🎣', '🥊', '🥋', '⛸', '🎿', '⛷', '🏂', '🏋️', '🤺', '🏌️', '🏄', '🏊', '🚣', '🏇', '🚵', '🪂', '🎽', '🏅', '🎖', '🥇', '🥈', '🥉', '🏆', '🏵', '🎗', '🎫', '🎟', '🎪', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🎷', '🎺', '🎸', '🎻', '🪕', '🎲', '🎯', '🎳', '🎮', '🎰', '🛷', '🥌', '🪀', '🪁', '🚗', '🚕', '🚙', '🚌', '🚎', '🏎', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🛴', '🚲', '🛵', '🛺', '🏍', '🦽', '🦼', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚉', '🚁', '🛩', '✈️', '🛫', '🛬', '🚀', '🛰', '💺', '🛶', '⛵️', '🛥', '🚤', '🛳', '⛴', '🚢', '⚓️', '🚧', '⛽️', '🚏', '🚦', '🚥', '🗺', '🗿', '🗽', '⛲️', '🗼', '🏰', '🏯', '🏟', '🎡', '🎢', '🎠', '⛱', '🏖', '🏝', '⛰', '🏔', '🗻', '🌋', '🏜', '🏕', '⛺️', '🛤', '🛣', '🏗', '🏭', '🏠', '🏡', '🏘', '🏚', '🏢', '🏬', '🏣', '🏤', '🏥', '🏦', '🏨', '🏪', '🏫', '🏩', '💒', '🏛', '⛪️', '🕌', '🕍', '🕋', '🛕', '⛩', '🗾', '🎑', '🏞', '🌅', '🌄', '🌠', '🎇', '🎆', '🌇', '🌆', '🏙', '🌃', '🌌', '🌉', '🌁', '🛸', '⌚️', '📱', '📲', '💻', '⌨️', '🖥', '🖨', '🖱', '🖲', '🕹', '🗜', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽', '🎞', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙', '🎚', '🎛', '⏱', '⏲', '⏰', '🕰', '⌛️', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯', '🗑', '🛢', '💸', '💵', '💴', '💶', '💷', '💰', '💳', '💎', '⚖️', '🔧', '🔨', '⚒', '🛠', '⛏', '🔩', '⚙️', '⛓', '🔫', '💣', '🔪', '🗡', '⚔️', '🪓', '🦯', '🛡', '🚬', '⚰️', '⚱️', '🏺', '🔮', '📿', '💈', '⚗️', '🔭', '🔬', '🕳', '💊', '💉', '🩸', '🩹', '🩺', '🌡', '🪒', '🚽', '🚰', '🚿', '🛁', '🛀', '🛎', '🔑', '🗝', '🚪', '🪑', '🛋', '🛏', '🛌', '🖼', '🛍', '🛒', '🎁', '🎈', '🎏', '🎀', '🎊', '🎉', '🎎', '🏮', '🎐', '✉️', '📩', '📨', '📧', '💌', '📥', '📤', '📦', '🏷', '📪', '📫', '📬', '📭', '📮', '📯', '📜', '📃', '📄', '📑', '📊', '📈', '📉', '🗒', '🗓', '📆', '📅', '📇', '🗃', '🗳', '🗄', '📋', '📁', '📂', '🗂', '🗞', '📰', '📓', '📔', '📒', '📕', '📗', '📘', '📙', '📚', '📖', '🔖', '🔗', '📎', '🖇', '📐', '📏', '📌', '📍', '📌', '🎌', '🏳️', '🏴', '🏁', '🪔', '✂️', '🖊', '🖋', '✒️', '🖌', '🖍', '📝', '✏️', '🔍', '🔎', '🔏', '🔐', '🔒', '🔓', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈️', '♉️', '♊️', '♋️', '♌️', '♍️', '♎️', '♏️', '♐️', '♑️', '♒️', '♓️', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚️', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕️', '🛑', '⛔️', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗️', '❕', '❓', '❔', '‼️', '⁉️', '🔅', '🔆', '〽️', '⚠️', '🚸', '🔱', '⚜️', '🔰', '♻️', '✅', '🈯️', '💹', '❇️', '✳️', '❎', '🌐', '💠', 'Ⓜ️', '🌀', '💤', '🏧', '🚾', '♿️', '🅿️', '🈳', '🈂️', '🛂', '🛃', '🛄', '🛅', '🚹', '🚺', '🚼', '🚻', '🚮', '🎦', '📶', '🈁', '🔣', 'ℹ️', '🔤', '🔡', '🔠', '🆖', '🆗', '🆙', '🆒', '🆕', '🆓', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔢', '#️⃣', '*️⃣', '▶️', '⏸', '⏯', '⏹', '⏺', '⏭', '⏮', '⏩', '⏪', '⏫', '⏬', '◀️', '🔼', '🔽', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '↪️', '↩️', '⤴️', '⤵️', '🔀', '🔁', '🔂', '🔄', '🔃', '🎵', '🎶', '➕', '➖', '➗', '✖️', '💲', '💱', '™️', '©️', '®️', '〰️', '➰', '➿', '🔚', '🔙', '🔛', '🔝', '✔️', '☑️', '🔘', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫️', '⚪️', '🟤', '🔺', '🔻', '🔸', '🔹', '🔶', '🔷', '🔳', '🔲', '▪️', '▫️', '◾️', '◽️', '◼️', '◻️', '⬛️', '⬜️', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫', '🔈', '🔇', '🔉', '🔊', '🔔', '🔕', '📣', '📢', '👁‍🗨', '💬', '💭', '🗯', '♠️', '♣️', '♥️', '♦️', '🃏', '🎴', '🀄️', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛', '🕜', '🕝', '🕞', '🕟', '🕠', '🕡', '🕢', '🕣', '🕤', '🕥', '🕦', '🕧', '⏏', '♀', '♂', '⚕', '♾️', ''];
	const DisplayNames = ['Your Mom', 'Miley Cyrus', 'Kim Kardashian', 'Kayne West', 'Margaret Thatcher', 'George Washington', 'Ghandi', 'Nelson Mandela', 'Christopher Columbus', 'Justin Beiber', 'Lady Gaga', 'Katy Perry', 'Justin Timberlake', 'Jay Leno', 'David Letterman', 'Elle McPherson', 'Jennifer Aniston', 'Donald Duck', 'Pluto', 'Goofy', 'Johnny Depp', 'Brittney Spears', 'Paris Hilton', 'Hugh Jackman', 'Vladimir Putin', 'Daniel Radcliffe', 'David Beckham', 'Madonna', 'Eminem', 'Matt Damon', 'Jack Nicholson', 'Kevin Spacey', 'Kylie Minogue', 'Roger Federer', 'Andrew Murray', 'Serena Williams', 'Brad Pitt', 'Mickey Mouse', 'Simon Cowell', 'Ludwig Beethoven', 'Warren Buffett', 'Lewis Carroll', 'Queen Elizabeth II', 'Charles Darwin', 'Albert Einstein', 'Henry Ford', 'Bill Gates', 'Steve Jobs', 'Vincent van Gogh', 'Thomas Jefferson', 'Stanley Kubrik', 'Charles Lindbergh', 'Courtney Love', 'Kurt Cobain', 'Michelangelo', 'Amadeus Mozart', 'Sir Isaac Newton', 'George Orwell', 'Andy Warhol', 'Orson Welles', 'Leonardo Da Vinci', 'Walt Disney', 'Abraham Lincoln', 'William Shakespeare', 'Martin Luther King', 'John F Kennedy', 'Princess Diana', 'Mother Teresa', 'Thomas Edison', 'Benjamin Franklin', 'Neil Armstrong', 'Napoleon', 'Elvis Presley', 'Mohammad Ali', 'Marilyn Monroe', 'Pablo Picasso', 'Charles Dickens', 'Cleopatra', 'John Lennon', 'Michael Jordan', 'Mark Twain', 'Nicole Kidman', 'Barack Obama', 'Robert Pattison', 'Hugh Heffner', 'KJ Rowling', 'Bill Clinton', 'Elizabeth Taylor', 'Tom Cruise', 'Clint Eastwood', 'Alfred Hitchcock', 'Stephen Hawking', 'Tom Hanks', 'Oprah Winfrey', 'Beyonce', 'Hilary Clinton', 'Dr Suess', 'Ray Charles', 'Sean Connery', 'Julia Roberts', 'Pele', 'Meryl Streep', 'Helen Keller', 'Robin Williams', 'Steve Martin', 'Fred Astaire', 'Whoopi Goldberg', 'Jane Austen', 'Bob Hope', 'Jessica Simpson', 'Frank Lloyd Wright', 'Pamela Anderson', 'Susan Boyle', 'Mae West', 'Snoopy', 'Jim Carrey', 'Michael J Fox'];
	/* eslint-enable array-bracket-newline, array-element-newline */
</script>

<script lang='ts'>
	import { RandomUtility } from '../../resources/utilities';
	import FillOrTwoToneButton from '../blocks/buttons/FillOrTwoToneButton.svelte';
	import Card from '../blocks/Card.svelte';
	import Fragment from '../blocks/Fragment.svelte';

	export let profilePicPlaceholder = RandomUtility.value(Emojis);
	export let userDisplayName = RandomUtility.value(DisplayNames);
	export let userName = userDisplayName.toLowerCase().replace(/[^\w]/g, '_');
	export let timestamp = `${Math.min(RandomUtility.int(2), 48)}${RandomUtility.string(1, 'hm')}`;
</script>

<Fragment
	isPadded={false}
	isInAnimated={true}
	isOutAnimated={true}
	height='auto'
	width='100%'
	justify='flex-start'
>
	<component>
		<container
			class='pp'
		>
			<container
				class='frame'
			>
				<heading>
					{profilePicPlaceholder}
				</heading>
			</container>
		</container>
		<container
			class='meta'
		>
			<string>
				<b>
					<a
						on:click={() => alert("Ouch, you poked me!")} 
						href={'javascript:void(0)'}
					>
						{userDisplayName}
					</a>
					@{userName}
					&middot;
					{timestamp}
				</b>
			</string>
		</container>
		<container
			class='content'
		>
			<string>
				<slot></slot>
			</string>
			{#if $$slots.rich}
				<Card
					width='100%'
					height='200px'
				>
					<slot
						name='rich'
					></slot>
				</Card>
			{/if}
		</container>
		<container
			class='actions'
		>
			<container
				class='reply'
				style='
					--colour-fill-hover-primary: #1da1f2;
					--colour-fill-hover-secondary: #1da1f233;
				'
			>
				<FillOrTwoToneButton
					backgroundColour='transparent'
					hoverColour='--colour-fill-hover-secondary'
					hoverFillColour='--colour-fill-hover-primary'
					hoverTwoToneFilter='brightness(0) saturate(100%) invert(61%) sepia(33%) saturate(7490%) hue-rotate(177deg) brightness(101%) contrast(90%)'
					icon='icecream'
					iconSize='1rem'
				>
					<string>
						{RandomUtility.int(2)}
					</string>
				</FillOrTwoToneButton>
			</container>
			<container
				class='retweet'
				style='
					--colour-fill-hover-primary: #17bf63;
					--colour-fill-hover-secondary: #17bf6333;
				'
			>
				<FillOrTwoToneButton
					backgroundColour='transparent'
					hoverColour='--colour-fill-hover-secondary'
					hoverFillColour='--colour-fill-hover-primary'
					hoverTwoToneFilter='brightness(0) saturate(100%) invert(52%) sepia(57%) saturate(796%) hue-rotate(98deg) brightness(101%) contrast(82%)'
					icon='wine_bar'
					iconSize='1rem'
				>
					<string>
						{RandomUtility.int(2)}
					</string>
				</FillOrTwoToneButton>
			</container>
			<container
				class='like'
				style='
					--colour-fill-hover-primary: var(--colour-accent-primary);
					--colour-fill-hover-secondary: var(--colour-accent-secondary);
				'
			>
				<FillOrTwoToneButton
					backgroundColour='transparent'
					hoverColour='--colour-fill-hover-secondary'
					hoverFillColour='--colour-fill-hover-primary'
					icon='dinner_dining'
					iconSize='1rem'
				>
					<string>
						{RandomUtility.int(3)}
					</string>
				</FillOrTwoToneButton>
			</container>
			<container
				class='report'
				style='
					--colour-fill-hover-primary: var(--colour-warn-primary);
					--colour-fill-hover-secondary: var(--colour-warn-secondary);
				'
			>
				<FillOrTwoToneButton
					backgroundColour='transparent'
					hoverColour='--colour-fill-hover-secondary'
					hoverFillColour='--colour-fill-hover-primary'
					hoverTwoToneFilter='brightness(0) saturate(100%) invert(67%) sepia(59%) saturate(635%) hue-rotate(331deg) brightness(101%) contrast(104%)'
					icon='report_problem'
					iconSize='1rem'
				>
				</FillOrTwoToneButton>
			</container>
		</container>
	</component>
</Fragment>

<style>
	component {
		display: grid;
		width: 100%;
		height: 100%;
		grid-template-areas: 
			"pp meta"
			"pp content"
			"_ actions";
		grid-template-columns: 64px 1fr;
		grid-template-rows: repeat(3, auto);

		padding: calc(var(--padding) / 2);
		padding-bottom: calc(var(--padding) / 4);
		border: solid 1px var(--colour-background-secondary);
		border-top: 0;
		box-sizing: border-box;
	}

	.pp {
		grid-area: pp;
	}

	.pp > .frame {
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--colour-background-secondary);

		height: 48px;
		width: 48px;
		border-radius: 100%;
		overflow: hidden;
	}

	.pp > .frame > heading {
		margin-left: -3px;
    	margin-top: 3px;
	}

	.meta {
		grid-area: meta;
	}

	.meta a,
	.meta a:link {
		color: var(--colour-text-primary);
	}

	.meta a:hover {
		color: var(--colour-text-secondary);
	}

	.meta > string {
		margin: 0;
    	margin-top: 4px;
	}

	.content {
		grid-area: content;
	}

	.content > string {
		margin: 0;
	}

	.actions {
		margin-left: -28px;
		grid-area: actions;
		display: grid;
		grid-template-areas: 
			"reply retweet like report";
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: 1fr;
		justify-items: flex-start;
		align-items: center;
	}

	.actions > .reply:hover *,
	.actions > .retweet:hover *,
	.actions > .like:hover *,
	.actions > .report:hover * {
		color: var(--colour-fill-hover-primary);
	}

	.actions string {
		margin: 0;
	}
</style>