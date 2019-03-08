describe("Basic testing", function() {
  "use strict";
  var fixture = loadFixtures('example.html');

  it("Basic Test", function () {
  expect(true).toBe(true);
  });

  it("Checks if at zoom level 5 , all 7 markers are shown", function () {
  //  BlurredLocation1.map.setZoom(5);

    expect($("#map1").children()[0].childNodes[3].childNodes.length).toBe(7) ;
  });

});
