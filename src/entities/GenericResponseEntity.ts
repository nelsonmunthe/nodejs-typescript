class GenericResponseEntity {
    success:boolean = false;
    message:string | null = '';
    messageTitle:string | null = '';
    data:any = null;
    summary:any = null;
    statusCode:number = 400;
    startTime: number = 0;

    constructor() {
        this.startTime = new Date().getTime();
    }

    toResponse() {
        this.statusCode = this.success ? 200 : (this.statusCode ?? 400);

        return {
            statusCode: this.statusCode,
            success: this.success,
            message: this.message,
            messageTitle: this.messageTitle,
            summary: this.summary,
            data: this.data,
            responseTime: this.startTime
                ? new Date().getTime() - this.startTime + " ms."
                : "unknown",
        };
    }

    errorResponse(message: string, code: number, data: any) {
        const res = new GenericResponseEntity();
        res.success = false;
        res.message = message;
        res.statusCode = code || 400;
        res.data = data;

        return res;
    }

    successResponse(message: string, code: number, data: any) {
        const res = new GenericResponseEntity();
        res.success = true;
        res.message = message;
        res.statusCode = code || 200;
        res.data = data;
        return res;
    }
}

export default GenericResponseEntity;
