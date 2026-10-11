const fs = require('fs');

let content = fs.readFileSync('src/components/forms/InvitationRequestForm.tsx', 'utf8');

// Find where roundtables are mapped
// We will inject a helper to get the selected session
const helperCode = `
  const selectedFirstChoice = roundtables.find(rt => rt.slug === formData.priority1Roundtable);
  const selectedFirstSession = selectedFirstChoice ? selectedFirstChoice.session : null;
  const availableSecondChoices = selectedFirstSession 
    ? roundtables.filter(rt => rt.session !== selectedFirstSession)
    : roundtables;
`;

content = content.replace("  const handleSubmit = async", helperCode + "\n  const handleSubmit = async");

// Replace the roundtables maps for choice 1 and 2, and delete choice 3
const oldChoicesBlockRegex = /<div id="field-priority1Roundtable">[\s\S]*?(?=<div id="field-contribution">)/;

const newChoicesBlock = `
          <div id="field-priority1Roundtable">
            <label htmlFor="priority1Roundtable" className="block text-xs font-semibold text-text-primary">
              Session 1 Roundtable Choice *
            </label>
            <select
              id="priority1Roundtable"
              required
              value={formData.priority1Roundtable || ''}
              onChange={(e) => {
                updateField('priority1Roundtable', e.target.value);
                // Clear the second choice if it's now invalid
                updateField('priority2Roundtable', '');
              }}
              className={\`mt-2 w-full rounded-sm border bg-bg-base px-4 py-2.5 text-sm text-text-primary focus:outline-none \${
                errors.priority1Roundtable ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
              }\`}
            >
              <option value="" disabled>Select your first roundtable choice</option>
              {roundtables.map((rt) => (
                <option key={rt.slug} value={rt.slug}>
                  Session {rt.session || 1} - Table {rt.order}: {rt.shortTitle}
                </option>
              ))}
              <option value="not-sure">Not sure / Open to curatorial allocation</option>
            </select>
            {errors.priority1Roundtable && (
              <p className="mt-1 text-xs text-brand-rose">{errors.priority1Roundtable}</p>
            )}
          </div>

          <div id="field-priority2Roundtable">
            <label htmlFor="priority2Roundtable" className="block text-xs font-semibold text-text-primary">
              Session 2 Roundtable Choice *
            </label>
            <select
              id="priority2Roundtable"
              required
              value={formData.priority2Roundtable || ''}
              onChange={(e) => updateField('priority2Roundtable', e.target.value)}
              disabled={!formData.priority1Roundtable || formData.priority1Roundtable === 'not-sure'}
              className={\`mt-2 w-full rounded-sm border bg-bg-base px-4 py-2.5 text-sm text-text-primary focus:outline-none disabled:opacity-50 \${
                errors.priority2Roundtable ? 'border-brand-rose' : 'border-border-subtle focus:border-brand-primary'
              }\`}
            >
              <option value="" disabled>
                {!formData.priority1Roundtable || formData.priority1Roundtable === 'not-sure' 
                  ? 'Select first choice first' 
                  : 'Select your second roundtable choice'}
              </option>
              {availableSecondChoices.map((rt) => (
                <option key={rt.slug} value={rt.slug}>
                  Session {rt.session || 1} - Table {rt.order}: {rt.shortTitle}
                </option>
              ))}
              <option value="not-sure">Not sure / Open to curatorial allocation</option>
            </select>
            {errors.priority2Roundtable && (
              <p className="mt-1 text-xs text-brand-rose">{errors.priority2Roundtable}</p>
            )}
            <p className="mt-2 text-[10px] text-text-muted leading-relaxed">
              Note: You can only select one table per session. Your second choice must be from the other session.
            </p>
          </div>

`;

content = content.replace(oldChoicesBlockRegex, newChoicesBlock);

fs.writeFileSync('src/components/forms/InvitationRequestForm.tsx', content);
