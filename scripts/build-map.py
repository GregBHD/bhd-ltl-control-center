"""Compile pinned us-atlas 3.0.1 Census-derived boundaries into local SVG paths.
Source: https://cdn.jsdelivr.net/npm/us-atlas@3.0.1/states-10m.json
Output uses a conic equal-area projection, contiguous US only, and approximate city centers.
"""
import json,math,pathlib,sys
src=json.load(open(sys.argv[1]));rad=math.pi/180
p1,p2,p0=29.5*rad,45.5*rad,38*rad
n=(math.sin(p1)+math.sin(p2))/2;c=math.cos(p1)**2+2*n*math.sin(p1);r0=math.sqrt(c-2*n*math.sin(p0))/n

def albers(lon,lat):
 r=math.sqrt(c-2*n*math.sin(lat*rad))/n;t=n*(lon+96)*rad
 return r*math.sin(t),-(r0-r*math.cos(t))
arcs=[]
for arc in src['arcs']:
 x=y=0;pts=[]
 for dx,dy in arc:
  x+=dx;y+=dy;pts.append(albers(x*src['transform']['scale'][0]+src['transform']['translate'][0],y*src['transform']['scale'][1]+src['transform']['translate'][1]))
 arcs.append(pts)
geoms=[g for g in src['objects']['states']['geometries'] if int(g['id'])<=56 and str(g['id']) not in ['02','15']]
def poly_rings(g):
 return g['arcs'] if g['type']=='Polygon' else [r for p in g['arcs'] for r in p]
def ring_points(r):
 pts=[]
 for a in r:
  seg=arcs[a] if a>=0 else list(reversed(arcs[~a]));pts.extend(seg if not pts else seg[1:])
 return pts
allpts=[p for g in geoms for r in poly_rings(g) for p in ring_points(r)]
xmin,ymin=min(x for x,y in allpts),min(y for x,y in allpts);xmax,ymax=max(x for x,y in allpts),max(y for x,y in allpts)
scale=min(960/(xmax-xmin),560/(ymax-ymin))
def xy(p):return [round(20+(p[0]-xmin)*scale,2),round(20+(p[1]-ymin)*scale,2)]
shapes=[]
for g in geoms:
 parts=[]
 for r in poly_rings(g):
  points=[xy(p) for p in ring_points(r)];parts.append('M'+'L'.join(f'{p[0]},{p[1]}' for p in points)+'Z')
 shapes.append({'id':g['id'],'name':g['properties']['name'],'d':''.join(parts)})
city={f['id']:f['coordinates'] for f in json.loads(pathlib.Path('dist/locations.js').read_text().split('export const facilities=',1)[1].split(';\nexport const locationSource',1)[0])}
city.update({'STL':[-90.1994,38.6270],'CLT':[-80.8431,35.2271],'DAY':[-84.1916,39.7589]})
labels={'TX':[-101.0,31.4],'OK':[-98.5,35.5],'KS':[-98.5,38.5],'NE':[-100,41.5],'SD':[-100,44.5],'ND':[-100,47.5],'MN':[-94.5,46],'IA':[-93.4,42.0],'MO':[-93.3,38.3],'WI':[-90.5,44.5],'IL':[-89.2,40.0],'IN':[-86.2,40.6],'MI':[-85.5,44.2],'OH':[-82.8,40.8],'PA':[-78.8,41.3],'NY':[-75.5,43.2],'AR':[-92.5,34.8],'LA':[-92.5,31.3],'MS':[-89.7,32.5],'AL':[-86.8,32.0],'TN':[-88.5,35.5],'KY':[-84.5,37.2],'GA':[-83.0,32.4],'FL':[-82.0,28.3],'SC':[-80.8,33.9],'NC':[-78.0,35.5],'VA':[-79.5,37.5],'WV':[-80.5,38.9],'CO':[-105.5,39.0],'NM':[-106,34.4],'UT':[-111.7,39.3],'AZ':[-112.5,34.0],'NV':[-117,39.2],'CA':[-120,37.4],'OR':[-120.5,44],'WA':[-120.7,47.4],'ID':[-114.7,44.2],'MT':[-110,47],'WY':[-107.6,43.2],'ME':[-69,45.4]}
world=json.load(open(sys.argv[2]));warcs=[]
for arc in world['arcs']:
 x=y=0;pts=[]
 for dx,dy in arc:
  x+=dx;y+=dy;lon=x*world['transform']['scale'][0]+world['transform']['translate'][0];lat=y*world['transform']['scale'][1]+world['transform']['translate'][1];pts.append(xy(albers(lon,lat)))
 warcs.append(pts)
background=[]
for g in world['objects']['countries']['geometries']:
 if str(g.get('id','')) not in ['124','484']:continue
 parts=[]
 for ring in poly_rings(g):
  pts=[]
  for a in ring:
   seg=warcs[a] if a>=0 else list(reversed(warcs[~a]));pts.extend(seg if not pts else seg[1:])
  parts.append('M'+'L'.join(f'{p[0]},{p[1]}' for p in pts)+'Z')
 background.append({'name':g['properties']['name'],'d':''.join(parts)})
result={'background':background,'states':shapes,'points':{k:xy(albers(*v)) for k,v in city.items()},'labels':[{ 'name':k,'xy':xy(albers(*v))} for k,v in labels.items()],'bounds':[0,0,1000,600]}
pathlib.Path('dist/map-geography.js').write_text('// Census-derived us-atlas 3.0.1 boundaries; see docs/MAP-SOURCES.md.\nexport const geography='+json.dumps(result,separators=(',',':'))+';\n')
print('Generated',len(shapes),'state shapes;',len(result['points']),'city/terminal centers; bytes:',pathlib.Path('dist/map-geography.js').stat().st_size)
print(result['points'])
