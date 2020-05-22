<template>
	<div id="new-event" @keypress.enter="createEvent">
		<div class="input-container">
			<input
				ref="title"
				v-model="title"
				type="text"
				placeholder="New Event"
				required
			/>
			<input v-model="date" type="date" required @focus="dateFocused()" />
			<input v-model="time" type="time" @focus="timeFocused()" />
		</div>
		<button @keypress.prevent @click="createEvent">Create</button>
	</div>
</template>

<script>
const moment = require("moment");

export default {
	name: "NewEvent",
	data() {
		return {
			title: "",
			date: "",
			time: "",
		};
	},
	methods: {
		dateFocused() {
			this.date =
				this.date === ""
					? moment().add(1, "days").format("YYYY-MM-DD").toString()
					: this.date;
		},
		timeFocused() {
			this.time =
				this.time === "" ? moment().format("HH:mm").toString() : this.time;
		},
		createEvent() {
			// console.log("Creating event - ", this.title);
			if (this.title === "" || this.date === "") {
				this.$notify({
					group: "forecast",
					type: "error",
					text: "Please enter a title and a date.",
				});
			} else {
				// Check if time is empty to avoid adding a space
				const due =
					this.time === ""
						? moment(this.date)
						: moment(`${this.date} ${this.time}`);
				this.$parent.addEvent(this.title, due);
				// Clear the form so the user can add another event
				this.title = "";
				this.date = "";
				this.time = "";
			}
			this.$refs.title.focus();
		},
	},
};
</script>

<style scoped lang="scss">
.input-container {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}
@media all and (max-width: 640px) {
	input {
		max-width: auto;
	}
	.input-container {
		flex-direction: column;
	}
}
#new-event {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 1em 2em;
	button {
		background: none;
		border-radius: 1em;
		color: var(--placeholder);
		border-width: 2px;
		border-color: var(--placeholder);
		// Default is 'outset' which causes the bevel effect
		border-style: solid;
		font-size: 1em;
		font-weight: 700;
		padding: 0.5em 1em;
		&:focus {
			outline: none;
			background: #00f;
			color: var(--light); // the blue is pretty dark, so always use light text
			border-color: #00f;
		}
	}
	input {
		background: transparent;
		border: none;
		height: 1.2em;
		font-size: 1.2em;
		max-width: 11rem;
		&,
		&::placeholder {
			color: var(--placeholder);
			font-family: var(--font-stack);
		}
		&[type="text"] {
			color: var(--foreground);
		}
		&[type="date"] {
			color: var(--placeholder);
			padding-right: 1rem;
		}
		&[type="date"]:focus,
		&[type="date"]:valid,
		&[type="time"]:focus {
			color: var(--foreground);
		}
		&:focus {
			outline: none;
		}
	}
	@media all and (max-width: 350px) {
		input {
			max-width: 10em;
		}
	}
}
</style>
