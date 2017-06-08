/*
  AM2017.06.07 - It's all about the PUT here.  Using Dynamo to do a PUT
*/

import uuid from 'uuid';
import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

export async function main(event, context, callback) {
  const data = JSON.parse(event.body);
  
  //Setting up request for PUT into Dynamo with data
  const params = {
    TableName: 'notes',
    Item: {
      userId: event.requestContext.authorizer.claims.sub,
      notesId: uuid.v1(),
      content: data.content,
      attachment: data.attachment,
      createdAt: new Date().getTime(),

    },
  };

  //Call made to dynamoDbLib to PUT data in Notes table
  try {
    //Logging the params right before it goes into the table
    console.log(params);
    const result = await dynamoDbLib.call('put', params);
    callback(null, success(params.Item));
  }
  catch(e) {
    console.log(e);
    callback(null, failure({status: false}));
  }
};