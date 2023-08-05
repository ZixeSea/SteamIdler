module.exports = () => {
  process.on('message', function (message) {
    console.log(message);
    process.exit();
  });
};
