const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("Exchange", () => {
  async function deployTokenAndExchangeFixture() {
    const name = "Token";
    const symbol = "TKN";
    const totalSupply = ethers.parseEther("1000000");

    const provider = ethers.provider;

    const [owner, user] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("Token");
    const token = await Token.deploy(name, symbol, totalSupply);

    const Exchange = await ethers.getContractFactory("Exchange");
    const exchange = await Exchange.deploy(token.getAddress());

    return {
      provider,
      owner,
      user,
      token,
      exchange,
    };
  }

  describe("addLiquidity", async () => {
    it("adds liquidity", async () => {
      const { provider, token, exchange } = await loadFixture(
        deployTokenAndExchangeFixture
      );
      const exchangeAddress = await exchange.getAddress();

      await token.approve(exchangeAddress, ethers.parseEther("200"));
      await exchange.addLiquidity(ethers.parseEther("200"), {
        value: ethers.parseEther("100"),
      });

      expect(await provider.getBalance(exchangeAddress)).to.equal(
        ethers.parseEther("100")
      );
      expect(await exchange.getReserve()).to.equal(ethers.parseEther("200"));
    });
  });
});
