export class ServiceResponse {
    constructor(
        public data: any,
        public message: string,
        public success: boolean
    ) {}
}