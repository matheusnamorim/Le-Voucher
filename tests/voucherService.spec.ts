import { jest } from "@jest/globals";
import voucherRepository from "repositories/voucherRepository";
import voucherService from "services/voucherService";

describe("voucherService test suite", () => {

  it("should create a voucher when is values valid", () => {
    const voucher = {
      code: "aaaavvvvA1",
      discount: 10
    }

    jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => {
      return undefined;
    });

    voucherService.createVoucher(voucher.code, voucher.discount);

  });

  it("should not create a voucher with repeat code", () => {
    const voucher = {
      code: "AB1",
      discount: 10
    }

    jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => {
      return {
        id: 1,
        code: voucher.code,
        discount: voucher.discount,
        used: false,
      }
    });

    const promise = voucherService.createVoucher(voucher.code, voucher.discount);
    expect(promise).rejects.toEqual({
      message: "Voucher already exist.",
      type: "conflict"
    });

  });

  it("should not apply discount for invalid voucher", () => {
    const voucher = {
      code: "AaaA11",
      discount: 50,
    }

    jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => {
      return undefined;
    });

    const amount = 101;
    const promise = voucherService.applyVoucher(voucher.code, amount);
    expect(promise).rejects.toEqual({
      message: "Voucher does not exist.",
      type: "conflict"
    });
  });

  it("should not apply discount for a voucher used", async () => {
    const voucher = {
      code: "AabA121",
      discount: 20,
    }

    jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => {
      return {
        id: 1,
        code: voucher.code,
        discount: voucher.discount,
        used: true,
      }
    });

    const amount = 101;
    const order = await voucherService.applyVoucher(voucher.code, amount);
    expect(order).toEqual({
      amount: amount,
      discount: voucher.discount,
      finalAmount: amount, 
      applied: false
    });
  });

  it("should not apply discount for values below 100", async () => {
    const voucher = {
      code: "AtA01",
      discount: 90
    }

    jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => {
      return {
        id: 1,
        code: voucher.code,
        discount: voucher.discount,
        used: false,
      }
    });

    jest.spyOn(voucherRepository, "useVoucher").mockImplementationOnce((): any => {});

    const amount = 99;
    const order = await voucherService.applyVoucher(voucher.code, amount);
    expect(order).toEqual({
      amount: amount,
      discount: voucher.discount,
      finalAmount: amount, 
      applied: false
    });

  });

  it("should apply a voucher when values is valid", async () => {
    const voucher = {
      code: "bac1010",
      discount: 90
    }

    jest.spyOn(voucherRepository, "getVoucherByCode").mockImplementationOnce((): any => {
      return {
        id: 1,
        code: voucher.code,
        discount: voucher.discount,
        used: false,
      }
    });

    const amount = 200;
    const order = await voucherService.applyVoucher(voucher.code, amount);
    expect(order).toEqual({
      amount: amount,
      discount: voucher.discount,
      finalAmount: amount - (amount * ( voucher.discount / 100)), 
      applied: true
    });

  });
});