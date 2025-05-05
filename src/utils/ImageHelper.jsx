const bufferToBase64 = (buffer) => {
  if (!buffer || !buffer.data || !buffer.contentType) {
    // console.error('Invalid buffer object:', buffer);
    return '';
  }

  return `data:${buffer.contentType};base64,${Buffer.from(buffer.data).toString('base64')}`;
};

export default bufferToBase64;
