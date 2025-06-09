# nacd

**N**ode.js **A**synchronous **C**allback **D**elayer. 

An event race detector based on delay injections at the Node.js API level. 

This is a repository that contains the source code of NACD, as well as the experimental package needed to replicate the experiments presented in the paper "_Event Race Detection for Node.js Using Delay Injections_", accepted in the European Conference on Object-Oriented Programming (ECOOP 2025). Please see our paper for futher details: [\<preprint\>](https://cs.au.dk/~amoeller/papers/nacd/paper.pdf). 

Citation: 
```bib
@InProceedings{nacd2025,
  author =       {Andr\'e{} Takeshi Endo and Anders M\o{}ller},
  title =        {Event Race Detection for Node.js Using Delay Injections},
  booktitle =    {Proc. 39th European Conference on Object-Oriented Programming (ECOOP)},
  year =         {2025},
  month =        {June},
}
```

The repository contains some external links to Google Drive, but they can be accessed anonymously. 


## Environment Requirements

The development, tests, and experiments were conducted in a machine with the following configurations:
- Dell XPS 9320 i7-1260P x 16
- 32 Gb RAM
- Ubuntu 22.04.4 LTS

To run the tool, we recommend: 

- Install nvm to manage different versions of Node.js (https://github.com/nvm-sh/nvm)
- While NACD itself works with newer versions of Node.js, some of benchmarks used in the experiments depend on older versions of Node.js. So, we adopted Node.js v.10
```bash
    nvm install 10
    nvm use 10
```

## Install and Usage

In the shell, run the following commands:
```bash
    git clone https://github.com/nacd/nacd.git
    cd nacd
    npm install
    npm link
```

To check if the install was successful, move the root dir of the project, and run:

```bash
    nacd --help
    node examples/fs/2.js
    nacd never node examples/fs/2.js
    nacd plain2 node examples/fs/2.js
```

With these steps, nacd will generate a logs folder, where two json files keep track of async operations intercepted and injected delays. Mode "plain2" is the default mode described in the paper, while mode "never" performs the instrumention but no delays are injected. [Click here to micro-benchmarks with examples using different async functions of Node.js built-in modules.](examples/README.md) You can use them to test numerous scenarios with nacd. 

NACD also has a test suite, run the command (it takes around 2 minutes): 
```bash
    npm test
```

## Main Components

### Model of the Node.js Asynchronous API

NACD adopts a model of the asynchronous behavior provided by the Node.js built-in modules. NACD uses this model to instrument the code and inject the delays. The model is available as a collection of JSON files, [check folder 'lib/model/modules/' to see them.](lib/model/modules/)

### Runtime System

Using the model defined previously, the NACD runtime system installs hooks in asynchronous operations that we intend to delay. To realize this functionality, we leverage JavaScript's built-in APIs: Proxy and Reflect. Its main functionalities are implemented in 3 classes, [check folder 'lib/mode/plain2/' to see them.](lib/mode/plain2/)
- Class Instrumenter contains methods that perform the instrumentation, taking into account the different code patterns identified in the paper. 
- Class Plain2Mode hijacks the module system.
- Class DelayInjector handles the delay injection mechnisms, taking into account simple delays and connected callbacks, as described in the paper. 

## Motivating Example

The motivating example shown in Section 2 of the paper is based on a flaky test of the fs-extra project. To see specific instructions about the example, [click here.](benchmarks/paper-motivating-example/README.md) 

## Experimental Package

The experiments were performed using benchmarks provided by the NodeRacer study (see [https://github.com/andreendo/noderacer](https://github.com/andreendo/noderacer?tab=readme-ov-file#experimental-package)). 

To ease replication, we make available all benchmarks and tools used: 

- Benchmarks (including Node.fz) [\<here\>](https://drive.google.com/file/d/1_U46xwpzDxXAS4LEBWm9eiaHpudiK-0K/view?usp=sharing)
- The NodeRacer tool [\<here\>](https://drive.google.com/file/d/16A8dt8pMv-o89R5ZMSCSjFwfOyu0MbXr/view?usp=sharing)

The initial instructions are:

- Download the two files aforementioned and unzip them 
- Edit the setup file and point it to the folder you unziped the benchmarks; [check the file here.](benchmarks/benchmark-folder.js)
- Install R (https://www.r-project.org) and package tidyverse (https://www.tidyverse.org) 
- Install Docker (https://www.docker.com)

Specific instructions for each research questions are:

- **RQ1 - Bug Reproduction**: Instructions for RQ1 can be found [here](benchmarks/comparison/README.md).
- **RQ2 - Number of Runs Until First Failure**: Instructions for RQ2 can be found [here](benchmarks/comparison/README.md).
- **RQ3 - Overhead**: Detailed instructions to obtain the results related to RQ3 can be found [here](benchmarks/overhead/README.md).