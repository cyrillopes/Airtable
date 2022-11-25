require('dotenv').config({ path: './config.env' });
const Airtable = require('airtable');
const base = new Airtable({ apiKey: process.env.API_KEY }).base(
  process.env.BASE_ID
);
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Employee = require('./util/database');

const port = process.env.PORT || 3001;
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
//Creating mongoose connection
mongoose
  .connect(DB, {
    // option just in case of deprecation warnings if the mongoose package get updated
    useNewUrlParser: true,
  })
  .then(() => console.log('DB connection successful'));

const minifiedVersion = (record) => {
  return {
    id: record.id,
    fields: record.fields,
  };
};

app.get('/', (req, res, next) => {
  base('Employee')
    .select({
      view: 'Grid view',
    })
    .eachPage(
      function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.

        records.forEach(async function (record) {
          const fields = record.fields; //Storing only data that is important
          const recId = fields.EMPLOYEE_ID; //Extracting empId for further use
          try {
            const empId = await Employee.find({ EMPLOYEE_ID: recId }); //Checking if emp already exists
            if (!empId || empId.length === 0) {
              await Employee.create(fields); //if not create one
              console.log('Data successfully loaded');
            } else return 'Up to date';
          } catch (error) {
            console.log(error);
          }
        });

        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();
      },
      function done(err) {
        if (err) {
          console.error(err);
          return;
        }
      }
    );
  res.send('Data Successfully Uploaded to MongoDB');
});

// app.patch('/update', (req, res) => {
//   base('Employee').update(
//     [
//       {
//         id: 'recXvFKH6bje0kYhJ',
//         fields: {
//           EMPLOYEE_ID: 198,
//           FIRST_NAME: 'Donald',
//           LAST_NAME: 'OConnell',
//           EMAIL: 'DOCONNEL',
//           PHONE_NUMBER: '650.507.9833',
//           HIRE_DATE: '2007-06-20T18:30:00.000Z',
//           JOB_ID: 'SH_CLERK',
//           SALARY: 2600,
//           COMMISSION_PCT: ' - ',
//           MANAGER_ID: '124',
//           DEPARTMENT_ID: 50,
//         },
//       },
//       {
//         id: 'recRLBqp79rXmUu5L',
//         fields: {
//           EMPLOYEE_ID: 199,
//           FIRST_NAME: 'Douglas',
//           LAST_NAME: 'Grant',
//           EMAIL: 'DGRANT',
//           PHONE_NUMBER: '650.507.9844',
//           HIRE_DATE: '2008-01-12T18:30:00.000Z',
//           JOB_ID: 'SH_CLERK',
//           SALARY: 2600,
//           COMMISSION_PCT: ' - ',
//           MANAGER_ID: '124',
//           DEPARTMENT_ID: 50,
//         },
//       },
//       {
//         id: 'recZh4JgLNl2joEhr',
//         fields: {
//           EMPLOYEE_ID: 200,
//           FIRST_NAME: 'Jennifer',
//           LAST_NAME: 'Whalen',
//           EMAIL: 'JWHALEN',
//           PHONE_NUMBER: '515.123.4444',
//           HIRE_DATE: '2003-09-16T18:30:00.000Z',
//           JOB_ID: 'AD_ASST',
//           SALARY: 4400,
//           COMMISSION_PCT: ' - ',
//           MANAGER_ID: '101',
//           DEPARTMENT_ID: 10,
//         },
//       },
//     ],
//     function (err, records) {
//       if (err) {
//         console.error(err);
//         return;
//       }
//       records.forEach(function (record) {
//         console.log(record.get('EMPLOYEE_ID'));
//       });
//     }
//   );
// });
//environment variable
app.listen(port, () => console.log(`Listening on port ${port}...`));
