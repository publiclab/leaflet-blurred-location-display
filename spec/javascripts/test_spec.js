describe("Basic testing", function() {

  var geocoder;

  beforeAll(function() {
    geocoder = jasmine.createSpyObj('Geocoder', ['geocode']);
    spyOn(google.maps, 'Geocoder').and.returnValue(geocoder);
  });

  beforeEach(function () {
    loadFixtures('example.html');
  });

  it("Basic Test", function () {
    expect(true).toBe(true);
  });

  it("Checks if at zoom level 5 , all 7 markers are shown", function () {
    expect($("#map1").children()[0].childNodes[3].childNodes.length).toBe(7) ;
  });

  it("Checks if at zoom level 6 , only 5 markers are shown", function () {
    expect($("#map2").children()[0].childNodes[3].childNodes.length).toBe(5) ;
  });

  it("Checks if at zoom level 8 , only 3 markers are shown", function () {
    expect($("#map3").children()[0].childNodes[3].childNodes.length).toBe(3) ;
  });

  it("maps are loaded", function () {
    expect(document.getElementById('map1')).toBeInDOM() ;
    expect($("#map2")).toBeInDOM() ;
    expect($("#map3")).toBeInDOM() ;
  });  

});
