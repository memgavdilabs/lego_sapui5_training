import Main from "com/gavdi/lego_sapui5_training/controller/Main.controller";

QUnit.module("Sample Main controller test");

QUnit.test("The Main controller class has a sayHello method", function (assert) {
	// as a very basic test example just check the presence of the "sayHello" method
	assert.strictEqual(typeof Main.prototype.sayHello, "function");
});
