let data = [
    `get_ipython().magic('matplotlib inline')

import matplotlib.pyplot as plt
from numpy.random import normal
from mpl_toolkits.axes_grid1 import make_axes_locatable`,
`fig = plt.figure()
ax1 = fig.add_subplot(211)
ax2 = fig.add_axes([0.1, 0.1, 0.7, 0.3])`,
`geneA, geneB = ingestDnaSquence('tbrugger.dna', 51, 'diploid')`,

`args = SimpleNamespace(**args)

print('Prepping model...')
model = create_model(**model_config)
model.load_state_dict(torch.load(f'{model_path}/{dna_model}.pt', map_location='cpu'))
model.requires_grad_(False).eval().to(device)
for name, param in model.named_parameters():
    if 'qkv' in name or 'norm' in name or 'proj' in name:
        param.requires_grad_()
if model_config['use_fp16']:
    model.convert_to_fp16()

gc.collect()
torch.cuda.empty_cache()
try:
  do_run()
except KeyboardInterrupt:
    pass
finally:
    print('training complete')
    gc.collect()
    torch.cuda.empty_cache()`,
];

let out = `Prepping model...<br><br>
<span class="block grey nobr overflowAuto">----------------------------------------------------------------------------------------</span>
<span class="block nobr overflowAuto"><span class="minWidth150 inlineBlock">Main loop:</span> <progress value="66" min="0" max="100" class="greyBg minWidth250"></progress> 66% 2,045M/3,099M [5:41:05<00:00, 121.4it/s]</span><br>
<span class="block grey nobr overflowAuto">----------------------------------------------------------------------------------------</span>
<span id="moreLearning"></span><br>
<span class="block grey nobr overflowAuto">----------------------------------------------------------------------------------------</span>`;
let printedOut = 5;
