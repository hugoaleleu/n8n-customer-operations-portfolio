const fs = require('node:fs');
const assert = require('node:assert/strict');
const path = require('node:path');
const workflow = JSON.parse(fs.readFileSync(path.join(__dirname, 'meeting-id-sample.json'), 'utf8'));
const source = workflow.nodes.find(n => n.name === 'Generate Meeting ID').parameters.jsCode;
const run = new Function('$input', source);
const exec = rows => run({all: () => rows.map(json => ({json}))});
const results = [];
function check(name, fn) { fn(); results.push({name, passed:true}); }
const notes = 'Demo meeting: Casey will review the onboarding checklist. No deadline was agreed.';
check('Repeatable eight-digit reference', () => {
 const a=exec([{meeting_notes:notes}])[0].json.meeting_id;
 assert.match(a,/^\d{8}$/); assert.equal(a,exec([{meeting_notes:notes}])[0].json.meeting_id);
});
check('Changed example notes produce a different reference', () => {
 assert.notEqual(exec([{meeting_notes:notes}])[0].json.meeting_id,exec([{meeting_notes:notes+' A second action was discussed.'}])[0].json.meeting_id);
});
check('Input fields are preserved', () => {
 const output=exec([{meeting_notes:notes,customer:'Demo Customer'}])[0].json;
 assert.equal(output.customer,'Demo Customer'); assert.equal(output.meeting_notes,notes);
});
check('Missing and blank notes are rejected', () => {
 for(const row of [{},{meeting_notes:''},{meeting_notes:'   '},{meeting_notes:null}]) assert.throws(()=>exec([row]),/Original meeting notes are missing/);
});
check('Multiple input records are handled', () => { assert.equal(exec([{meeting_notes:notes},{meeting_notes:'Another fictional meeting.'}]).length,2); });
check('No credentials or runtime data; workflow inactive', () => {
 assert.equal(workflow.active,false); assert.ok(!workflow.pinData); assert.ok(!workflow.staticData);
 for(const n of workflow.nodes) assert.ok(!n.credentials);
 const names=new Set(workflow.nodes.map(n=>n.name));
 for(const [name,ports] of Object.entries(workflow.connections)){assert.ok(names.has(name)); for(const branches of Object.values(ports)) for(const branch of branches) for(const edge of branch) assert.ok(names.has(edge.node));}
});
const report={scope:'Exported Code-node JavaScript executed with stubbed n8n input; not live n8n execution.',checks:results,example_output:exec([{meeting_notes:notes}])[0].json};
fs.writeFileSync(path.join(__dirname,'check-results.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({passed:results.length,failed:0,example_id:report.example_output.meeting_id}));
