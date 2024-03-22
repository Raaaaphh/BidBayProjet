import { authors, group } from "../../../meta/authors";

describe("Meta", () => {
  it("Remplisser les infos de votre groupe dans frontend/meta/authors.js", () => {
    expect(authors).to.not.deep.eq([
      "John Doe (p12345678)",
      "Jane Doe (p12345678)",
    ]);

    expect(group).to.oneOf([1, 2, 3]);
  });
});
