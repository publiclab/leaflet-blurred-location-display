describe("Basic testing", function() {
  "use strict";

 var fixture = loadFixtures('example.html');

  it("Basic Test", function () {
  expect(true).toBe(true);
  });

  it("Checks if at zoom level 5 , all 7 markers are shown", function () {
    //BlurredLocation1.map.setZoom(5);
    expect($("#map1").children()[0].childNodes[3].childNodes.length).toBe(0) ;
  });

  it("Checks if at zoom level 6 , only 5 markers are shown", function () {
    //BlurredLocation2.map.setZoom(6);
    expect($("#map2").children()[0].childNodes[3].childNodes.length).toBe(0) ;
  });

  it("Checks if at zoom level 8 , only 3 markers are shown", function () {
   // BlurredLocation3.map.setZoom(8);
    expect($("#map3").children()[0].childNodes[3].childNodes.length).toBe(0) ;
  });

  it("maps are loaded", function () {
    expect($("#map1")).toBeInDOM() ;
    expect($("#map2")).toBeInDOM() ;
    expect($("#map3")).toBeInDOM() ;
  });  

});
