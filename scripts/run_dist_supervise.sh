NUM_GPU=2

WANDB_PROJECT='vsimcse-xml-roberta-large' \
WANDB_API_KEY='' \
CUDA_VISIBLE_DEVICE=0,1 python -m torch.distributed.launch --nproc_per_node $NUM_GPU \
    msts/train.py \
        --model_name_or_path xlm-roberta-large \
        --train_file '/home/tiennv/Datasets/translation/triplet_vin_viet_64.json' \
        --output_dir output/vimcse-xlm-roberta-large-3 \
        --num_train_epochs 3 \
        --per_device_train_batch_size 32 \
        --gradient_accumulation_steps 2 \
        --learning_rate 5e-5 \
        --max_seq_length 64 \
        --pad_to_max_length \
        --save_steps 2000 \
        --logging_steps 200 \
        --pooler_type cls \
        --overwrite_output_dir \
        --temp 0.05 \
        --do_train \
        --do_eval \
        --fp16 \
        --report_to 'wandb' \
        "$@"