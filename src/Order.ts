
class Order {
    constructor(
        private readonly registry: string,
        private readonly maker: string,
        private readonly staticTarget: string,
        private readonly staticSelector: number,
        private readonly staticExtradata: any,
        private readonly maximumFill: any,
        private readonly listingTime: Number,
        private readonly expirationTime: Number,
        private readonly salt: number
        ) {
    }
}

export default Order