
export default {
	formatValue: (value: string) => {
		return value?.toUpperCase();
	},

	formatAvailabilityStatus: (value: number, availabilityTreshold: number) => {
		if(value > availabilityTreshold){
			return 'Success'
		} else {
			return 'Warning'
		}
	},
};
