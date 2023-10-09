"use strict";
exports.__esModule = true;
exports.TransferLogic = void 0;
var TransferLogic = /** @class */ (function () {
    function TransferLogic() {
    }
    TransferLogic.isTransferStatus = function (_a) {
        var transfer = _a.transfer, _b = _a.statuses, statuses = _b === void 0 ? [] : _b;
        return statuses.includes(transfer.status);
    };
    TransferLogic.isReturnOrderEventResultCode = function (_a) {
        var resultCode = _a.resultCode, _b = _a.codes, codes = _b === void 0 ? [] : _b;
        return codes.includes(resultCode);
    };
    return TransferLogic;
}());
exports.TransferLogic = TransferLogic;
