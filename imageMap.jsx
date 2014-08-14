#target photoshop

//Location to save output file
var coords = new File('~/Desktop/coords.txt');
coords.open('w');

//Use current document
var doc = app.activeDocument;
//Number of layers in document
var length = doc.artLayers.length;

//Set units to pixels
app.preferences.rulerUnits = Units.PIXELS;
app.preferences.typeUnits = TypeUnits.PIXELS;

for (var currentLayer = 0; currentLayer < length; currentLayer++){

	//Set current layer active
	activeDocument.activeLayer = activeDocument.artLayers.getByName(doc.artLayers[currentLayer].name);

	//Select pixels of current layer
	var desc = new ActionDescriptor();
	var ref = new ActionReference();
	ref.putProperty(charIDToTypeID('Chnl'),charIDToTypeID('fsel'));
	desc.putReference(charIDToTypeID('null'),ref);
	var ref1 = new ActionReference();
	ref1.putEnumerated(charIDToTypeID('Chnl'),charIDToTypeID('Chnl'),charIDToTypeID('Trsp'));
	desc.putReference(charIDToTypeID('T   '),ref1);
	executeAction(charIDToTypeID('setd'),desc,DialogModes.NO);

	//Turn the selection into a work path and assign to wPath
	doc.selection.makeWorkPath(0);//Set tolerance (in pixels). 0 for sharp corners
	var wPath = doc.pathItems['Work Path'];

	var stride = 1; //2 means every 2nd, 3 means every 3rd, etc. Minimum 1

	//Loop through all path points and add their anchor coordinates to the output text
	coords.write('<area shape="poly" coords="');

	for (var i=0; i<wPath.subPathItems[0].pathPoints.length; i++) {
		if (i % stride === 0) {
			coords.write(wPath.subPathItems[0].pathPoints[i].anchor);
			if(i != wPath.subPathItems[0].pathPoints.length - 1){
				coords.write(',');
			}
		}
	}

	coords.write('" alt="' + doc.artLayers[currentLayer].name);
	coords.write('" href="#" />');
	coords.write('\n');

	//Remove the work path
	wPath.remove();
}

//Close file
coords.close();

alert('Operation Complete');
