import * as test from "../../lib/lib_validate";

describe("server", () => {
    describe("#greetVisitor", () => {
        it("returns a greeting if the string is ten characters or fewer", async () => {
            const short_greeting = "World!";
            const ret = await test.greetVisitor(short_greeting);

            expect(ret).toEqual("Hello World!");
        });

        it("errors if the string is over 10 characters", async () => {
            const long_greeting = "This string is too long";
            const ret = await test.greetVisitor(long_greeting);

            expect(ret).toEqual("ret_error_string");
        });
    });
});
