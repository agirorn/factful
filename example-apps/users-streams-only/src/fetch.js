import fetch from 'node-fetch';

const POST = async (url, body) => {
  const response = await fetch(url, {
    method: 'post',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
  return response;
};

const postCommand = async (event) => POST(
  `${document.location.origin}/command`,
  event,
);

const post = async (path, data) => POST(
  `${document.location.origin}${path}`,
  data,
);

export {
  postCommand,
  post,
};
