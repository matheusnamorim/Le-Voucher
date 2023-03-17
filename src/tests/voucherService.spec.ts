import { jest } from "@jest/globals";
import { validateSchemaMiddleware } from "middlewares/validateSchemaMiddleware";
import voucherRepository from "repositories/voucherRepository";
import voucherService from "services/voucherService";

describe("voucherService test suite", () => {

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

  it("should not apply discount for a voucher used", () => {
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
    const promise = voucherService.applyVoucher(voucher.code, amount);
    expect(promise).rejects.toEqual({
      message: "Voucher has already been used.",
      type: "conflict"
    });
    
  });

});