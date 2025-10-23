export class IndexController {
    public getIndex(req: any, res: any): void {
        res.send('Welcome to the Express App!');
    }
}