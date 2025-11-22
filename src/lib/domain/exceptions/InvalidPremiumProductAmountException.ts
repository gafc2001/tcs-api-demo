export class InvalidPremiumProductAmountException extends Error {
  constructor(message: string = 'Premium product amount is invalid') {
    super(message);
  }
}
