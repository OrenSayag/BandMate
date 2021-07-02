import { BankComponent } from "../components/bank/bank.component";
import LogsModel from "./logs.model";
import RecordingsModel from "./recordings.model";
import PostsModel from "./posts.model";

export default interface MainContentModel{
    logs:LogsModel[],
    recordings:RecordingsModel[],
    posts:PostsModel[],
}