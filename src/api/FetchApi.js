import React from 'react';

export const CurrApi = async () => {
  const resp = fetch('https://www.cbr-xml-daily.ru/daily_json.js');
  return resp;
};
