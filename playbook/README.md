# saasbox-playbook

Ansible Playbook for the Saasbox Application Platform

## Requirements

* Ansible 1.4+

With pip:
`$ pip install ansible`

With brew:
`$ brew install ansible`

*Roles will need to be downloaded from Ansible Galaxy*

```
$ ansible-galaxy install -p . angstwad.docker_ubuntu
```

## Webservers

Edit webservers in the 'hosts' inventory file.

Then just run `./play`

## Agents

Agents are built dynamically through the `mkagent` script; but first:

* provision an ubuntu server with local public key authorized on root

* map the server's ip address to a domain name (e.g. ag01.deadsimplecloud.com)

* run `NAME=ag01 SECRET=your-secret-token IMAGE=niallo/strider:latest ./mkagent`

* hit https://ag01.deadsimplecloud.com with your SECRET to use the new agent
