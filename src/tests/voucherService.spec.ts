import { jest } from "@jest/globals";
import { validateSchemaMiddleware } from "middlewares/validateSchemaMiddleware";
import voucherRepository from "repositories/voucherRepository";
import voucherService from "services/voucherService";

describe("voucherService test suite", () => {

  it("voucher code must be unique", () => {
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

});