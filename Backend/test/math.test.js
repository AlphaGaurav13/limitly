function add(a, b) {
    return a + b;
}

test("adds 2 and 3 correctly", () => {
    expect(add(2,3)).toBe(5);
})