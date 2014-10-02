# saasbox-playbook

Ansible Playbook for the Saasbox Application Platform

## Requirements

* Ansible 1.4+

With pip:
`$ pip install ansible`

With brew:
`$ brew install ansible`

## Webservers

Edit webservers in the 'hosts' inventory file.

Then just run `./play`

## Agents

Agents are built dynamically through the `mkagent` script by the saasbox-app workers
