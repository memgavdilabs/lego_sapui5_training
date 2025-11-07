export default {
	name: "QUnit test suite for the UI5 Application: com.gavdi.lego_sapui5_training",
	defaults: {
		page: "ui5://test-resources/com/gavdi/lego_sapui5_training/Test.qunit.html?testsuite={suite}&test={name}",
		qunit: {
			version: 2
		},
		sinon: {
			version: 4
		},
		ui5: {
			language: "EN",
			theme: "sap_horizon"
		},
		coverage: {
			only: "com/gavdi/lego_sapui5_training/",
			never: "test-resources/com/gavdi/lego_sapui5_training/"
		},
		loader: {
			paths: {
				"com/gavdi/lego_sapui5_training": "../"
			}
		}
	},
	tests: {
		"unit/unitTests": {
			title: "Unit tests for com.gavdi.lego_sapui5_training"
		},
		"integration/opaTests": {
			title: "Integration tests for com.gavdi.lego_sapui5_training"
		}
	}
};
