import * as DynamoDB from "aws-sdk/clients/dynamodb";
import { DocumentClient } from "aws-sdk/lib/dynamodb/document_client";

export const batchWrite = <T>(tableName: string, items: T[]) => {
  const dynamoDb = new DynamoDB.DocumentClient();

  const dynamoFormatItems: { PutRequest: { Item: T } }[] = items.map(
    (item) => ({ PutRequest: { Item: item } })
  );

  const writeParams: DocumentClient.BatchWriteItemInput = {
    RequestItems: { [tableName]: dynamoFormatItems },
  };

  return dynamoDb.batchWrite(writeParams).promise();
};
