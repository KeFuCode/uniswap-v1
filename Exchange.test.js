const { expect } = require("chai");

describe("Exchange", () => {
  let token;
  let exchange;

  async function deployTokenAndExchange() {
    const name = "Token";
    const symbol = "TKN";
    const totalSupply = ethers.utils.parseEther("1000000");

    const [owner, user] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy(name, symbol, totalSupply);

    const Exchange = await ethers.getContractFactory("Exchange");
    exchange = await Exchange.deploy(token.address);

    return { token, exchange, owner, user };
  }

  describe("Exchange", async () => {
    it("test before each", async () => {
      console.log("Running beforeEach");
      const { token, exchange, owner, user } = await deployTokenAndExchange();
      console.log("Running beforeEach 2");
    });
  });

  //   describe("addLiquidity", async () => {
  //     it("adds liquidity", async () => {
  //       await token.approve(exchange.address, parseEther("100"));
  //       await exchange.addLiquidity(parseEther("200"), {
  //         value: parseEther("100"),
  //       });

  //       expect(await token.balanceOf(exchange.address)).to.equal(
  //         parseEther("200")
  //       );
  //       expect(await exchange.getReverse()).to.equal(parseEther("100"));
  //     });
  //   });
});
