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

  describe("getPrice", async () => {
    it("returns correct prices", async () => {
      const { provider, token, exchange } = await loadFixture(
        deployTokenAndExchangeFixture
      );
      const exchangeAddress = await exchange.getAddress();

      await token.approve(exchangeAddress, ethers.parseEther("2000"));
      await exchange.addLiquidity(ethers.parseEther("2000"), {
        value: ethers.parseEther("1000"),
      });

      const tokenReserve = await exchange.getReserve();
      const ethReserve = await provider.getBalance(exchangeAddress);

      expect(await exchange.getPrice(ethReserve, tokenReserve)).to.equal(500);
      expect(await exchange.getPrice(tokenReserve, ethReserve)).to.equal(2000);
    });
  });

  describe("getTokenAmount", async () => {
    it("returns correct token amount", async () => {
      const { token, exchange } = await loadFixture(
        deployTokenAndExchangeFixture
      );
      const exchangeAddress = await exchange.getAddress();

      await token.approve(exchangeAddress, ethers.parseEther("2000"));
      await exchange.addLiquidity(ethers.parseEther("2000"), {
        value: ethers.parseEther("1000"),
      });

      let tokensOut = await exchange.getTokenAmount(ethers.parseEther("1"));
      expect(tokensOut).to.equal(ethers.parseEther("1.998001998001998001"));

      tokensOut = await exchange.getTokenAmount(ethers.parseEther("100"));
      expect(tokensOut).to.equal(ethers.parseEther("181.818181818181818181"));

      tokensOut = await exchange.getTokenAmount(ethers.parseEther("1000"));
      expect(tokensOut).to.equal(ethers.parseEther("1000"));
    });
  });

  describe("getEthAmount", async () => {
    it("returns correct eth amount", async () => {
      const { token, exchange } = await loadFixture(
        deployTokenAndExchangeFixture
      );
      const exchangeAddress = await exchange.getAddress();

      await token.approve(exchangeAddress, ethers.parseEther("2000"));
      await exchange.addLiquidity(ethers.parseEther("2000"), {
        value: ethers.parseEther("1000"),
      });

      let ethOut = await exchange.getEthAmount(ethers.parseEther("2"));
      expect(ethOut).to.equal(ethers.parseEther("0.999000999000999"));

      ethOut = await exchange.getEthAmount(ethers.parseEther("100"));
      expect(ethOut).to.equal(ethers.parseEther("47.619047619047619047"));

      ethOut = await exchange.getEthAmount(ethers.parseEther("2000"));
      expect(ethOut).to.equal(ethers.parseEther("500"));
    });
  });
});
